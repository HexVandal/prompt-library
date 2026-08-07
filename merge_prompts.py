import json
import re
import os
import subprocess

def merge_and_update():
    print("Loading MotionSites 132 free prompts...")
    with open('free_prompts/all_132_free_prompts.json', 'r', encoding='utf-8') as f:
        ms_prompts = json.load(f)

    with open('src/data/prompts.ts', 'r', encoding='utf-8') as f:
        ts_content = f.read()

    match = re.search(r'export const PROMPTS_DATA: LibraryPrompt\[\] = (\[.*\]);', ts_content, re.DOTALL)
    existing_prompts = json.loads(match.group(1)) if match else []

    print(f"Existing prompts count: {len(existing_prompts)}")

    def norm_text(t):
        if not t: return ''
        return re.sub(r'\s+', ' ', t.strip().lower())[:150]

    existing_by_norm = {}
    for ep in existing_prompts:
        existing_by_norm[norm_text(ep['content'])] = ep

    merged = list(existing_prompts)
    next_id = max([int(p['id']) for p in existing_prompts if str(p['id']).isdigit()] or [18]) + 1
    added_count = 0
    skipped_count = 0

    for ms in ms_prompts:
        ms_text = ms.get('full_prompt_text', '') or ''
        ms_norm = norm_text(ms_text)

        matched_ep = None
        for norm_k in existing_by_norm:
            if norm_k and ms_norm and (norm_k in ms_norm or ms_norm in norm_k):
                matched_ep = existing_by_norm[norm_k]
                break

        if matched_ep:
            skipped_count += 1
            continue

        title = ms.get('title', 'Untitled Prompt')
        category = ms.get('category', 'General')
        ptype = ms.get('type', 'component')
        page_type = ms.get('page_type', 'general')

        colors = list(set(re.findall(r'#[0-9a-fA-F]{3,6}\b', ms_text)))
        font_matches = re.findall(r"['\"]([A-Z][a-zA-Z\s]+)['\"]\s*(?:font|\(for|font-family)\b", ms_text)
        fonts = list(set(font_matches)) if font_matches else ['Inter']

        tags = set([category.lower().replace(' ', '-'), ptype.lower().replace(' ', '-'), page_type.lower().replace(' ', '-')])
        if 'dark' in ms_text.lower(): tags.add('dark-mode')
        if 'glass' in ms_text.lower() or 'glassmorphism' in ms_text.lower(): tags.add('glassmorphism')
        if 'video' in ms_text.lower() or ms.get('video_preview_url'): tags.add('video-background')
        if '3d' in ms_text.lower(): tags.add('3d')
        if 'animated' in ms_text.lower() or 'motion' in ms_text.lower(): tags.add('animation')
        if 'hero' in ptype.lower() or 'hero' in title.lower(): tags.add('hero')
        if 'footer' in ptype.lower() or 'footer' in title.lower(): tags.add('footer')
        if 'pricing' in ptype.lower() or 'pricing' in title.lower(): tags.add('pricing')
        tags.add('tailwind')
        tags.add('react')

        components = []
        sec_list = ms.get('sections', [])
        if sec_list:
            for s in sec_list:
                if isinstance(s, dict) and s.get('name'):
                    clean_comp_name = re.sub(r'[^a-zA-Z0-9]', '', str(s['name']))
                    if clean_comp_name:
                        components.append({
                            'name': clean_comp_name,
                            'type': ptype.upper().replace('-', '_'),
                            'description': f"{s.get('name')} section spec"
                        })
        if not components:
            clean_name = re.sub(r'[^a-zA-Z0-9]', '', str(title)) or 'MainComponent'
            components.append({
                'name': clean_name,
                'type': ptype.upper().replace('-', '_'),
                'description': f"{title} {category} spec"
            })

        new_prompt = {
            'id': str(next_id),
            'title': f"{title} ({category})",
            'description': f"{title} — {category} prompt template from MotionSites library.",
            'content': ms_text,
            'videoUrl': ms.get('video_preview_url') or ms.get('image_preview_url'),
            'tags': sorted(list(tags)),
            'components': components,
            'patterns': {
                'colors': colors if colors else ['#000000', '#ffffff'],
                'fonts': fonts,
                'borderRadius': ['rounded-lg', 'rounded-xl', 'rounded-full'],
                'shadows': ['shadow-sm', 'shadow-md'],
                'animations': ['fade-in', 'slide-up'],
                'transitions': ['transition-all', 'duration-300']
            },
            'version': 1,
            'createdAt': ms.get('created_at', '2026-08-05T00:00:00.000Z'),
            'updatedAt': '2026-08-05T00:00:00.000Z',
            'isArchived': False
        }

        merged.append(new_prompt)
        next_id += 1
        added_count += 1

    print(f"\nDeduplication Summary:")
    print(f" - Initial existing prompts kept: {len(existing_prompts)}")
    print(f" - Duplicate MotionSites prompts identified: {skipped_count}")
    print(f" - New unique prompts added: {added_count}")
    print(f" - Total prompts in library: {len(merged)}")

    # Update src/data/prompts.ts
    header = (
        "export interface ComponentSpec {\n"
        "  name: string\n"
        "  type: string\n"
        "  description: string\n"
        "}\n\n"
        "export interface PromptPatterns {\n"
        "  colors: string[]\n"
        "  fonts: string[]\n"
        "  borderRadius: string[]\n"
        "  shadows: string[]\n"
        "  animations: string[]\n"
        "  transitions: string[]\n"
        "}\n\n"
        "export interface LibraryPrompt {\n"
        "  id: string\n"
        "  title: string\n"
        "  description: string\n"
        "  content: string\n"
        "  videoUrl?: string | null\n"
        "  tags: string[]\n"
        "  components: ComponentSpec[]\n"
        "  patterns: PromptPatterns\n"
        "  version: number\n"
        "  createdAt: string\n"
        "  updatedAt: string\n"
        "  isArchived: boolean\n"
        "}\n\n"
        "export const PROMPTS_DATA: LibraryPrompt[] = "
    )

    new_ts_content = header + json.dumps(merged, indent=2, ensure_ascii=False) + ";\n"

    with open('src/data/prompts.ts', 'w', encoding='utf-8') as f:
        f.write(new_ts_content)
    print("Successfully updated src/data/prompts.ts!")

    # Update prompts.txt
    all_contents = [p['content'] for p in merged if p.get('content')]
    prompts_txt_content = "\n\n\n".join(all_contents) + "\n"

    with open('prompts.txt', 'w', encoding='utf-8') as f:
        f.write(prompts_txt_content)
    print("Successfully updated prompts.txt with all 132 prompts!")

if __name__ == '__main__':
    merge_and_update()
