import urllib.request
import json
import re
import os

def download_prompts():
    print("Starting automated download of all 132 free prompts from MotionSites...")

    # Fetch JS bundle to get latest anon key
    js_url = 'https://motionsites.ai/assets/index-DMNiW0I5.js'
    req_js = urllib.request.Request(js_url, headers={'User-Agent': 'Mozilla/5.0'})
    with urllib.request.urlopen(req_js) as resp:
        content = resp.read().decode('utf-8')
        anon_key = re.findall(r'eyJ[a-zA-Z0-9_-]+\.[a-zA-Z0-9_-]+\.[a-zA-Z0-9_-]+', content)[0]

    sb_url = 'https://xgdzyqfalbibzelpdpvr.supabase.co'
    headers = {
        'apikey': anon_key,
        'Authorization': f'Bearer {anon_key}'
    }

    # Fetch metadata for all free prompts
    query_url = f'{sb_url}/rest/v1/prompts?select=id,title,category,type,page_type,image_preview_url,video_preview_url,created_at&is_free=eq.true&order=created_at.desc'
    req = urllib.request.Request(query_url, headers=headers)
    with urllib.request.urlopen(req) as resp:
        prompts_meta = json.loads(resp.read().decode('utf-8'))

    print(f"Retrieved metadata for {len(prompts_meta)} free prompts.")

    out_dir = '/Users/creator/prompt-library/free_prompts'
    os.makedirs(out_dir, exist_ok=True)

    fn_url = f'{sb_url}/functions/v1/get-prompt'
    fn_headers = {
        'apikey': anon_key,
        'Authorization': f'Bearer {anon_key}',
        'Content-Type': 'application/json'
    }

    downloaded_count = 0
    all_prompts_data = []

    for idx, meta in enumerate(prompts_meta, 1):
        pid = meta.get('id')
        title = meta.get('title', 'Untitled')

        body = json.dumps({'prompt_id': pid}).encode('utf-8')
        fn_req = urllib.request.Request(fn_url, data=body, headers=fn_headers, method='POST')

        prompt_text = ''
        sections = []
        try:
            with urllib.request.urlopen(fn_req) as fn_resp:
                res_data = json.loads(fn_resp.read().decode('utf-8'))
                prompt_text = res_data.get('prompt_text', '')
                sections = res_data.get('sections', [])
        except Exception as e:
            print(f"Error fetching prompt content for '{pid}': {e}")

        full_obj = {**meta, 'full_prompt_text': prompt_text, 'sections': sections}
        all_prompts_data.append(full_obj)

        clean_title = re.sub(r'[^\w\s-]', '', str(title)).strip().replace(' ', '_')
        filename = os.path.join(out_dir, f"{idx:03d}_{pid}_{clean_title}.md")

        md_content = (
            f"# {title}\n\n"
            f"- **ID:** `{pid}`\n"
            f"- **Category:** {meta.get('category')}\n"
            f"- **Type:** {meta.get('type')}\n"
            f"- **Page Type:** {meta.get('page_type')}\n"
            f"- **Preview Image:** {meta.get('image_preview_url')}\n"
            f"- **Preview Video:** {meta.get('video_preview_url')}\n\n"
            f"---\n\n"
            f"## Full Prompt\n\n```text\n{prompt_text}\n```\n"
        )

        with open(filename, 'w', encoding='utf-8') as f:
            f.write(md_content)

        downloaded_count += 1
        if idx % 15 == 0 or idx == len(prompts_meta):
            print(f"Progress: [{idx}/{len(prompts_meta)}] prompts downloaded...")

    json_path = os.path.join(out_dir, 'all_132_free_prompts.json')
    with open(json_path, 'w', encoding='utf-8') as f:
        json.dump(all_prompts_data, f, indent=2, ensure_ascii=False)

    print(f"\nSUCCESS! Downloaded all {downloaded_count} free prompts.")
    print(f"Combined JSON saved to: {json_path}")
    print(f"Individual Markdown files saved in: {out_dir}/")

if __name__ == '__main__':
    download_prompts()
