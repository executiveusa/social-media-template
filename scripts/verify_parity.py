from pathlib import Path
import json, sys

root = Path(__file__).resolve().parents[1]
html = (root / 'index.html').read_text(encoding='utf-8')
css = (root / 'styles.css').read_text(encoding='utf-8')
manifest = json.loads((root / 'clients/asc3nd/manifest.json').read_text(encoding='utf-8'))

checks = {
    'three weekly tiles': html.count('asc-test-tile ') == 3,
    'three interactive cards': html.count('<details class="asc-test-card"') == 3,
    'monday copy': 'PROGRAMS &amp; VALUES' in html,
    'wednesday copy': 'WHAT A MENTOR CAN DO' in html,
    'friday copy': 'COMMUNITY CUTS' in html,
    'desktop grid': 'grid-template-columns:repeat(3,1fr)' in css,
    'tablet breakpoint': '@media screen and (max-width:991px)' in css,
    'mobile breakpoint': '@media screen and (max-width:767px)' in css,
    'portrait breakpoint': '@media screen and (max-width:479px)' in css,
    'monday source': '1YeljR3ZRMb479N8Y_OVsrMpHntal1tva' in css,
    'wednesday source': '1MvcC066NSVh9gj8gVVdgoXQe0-7igayh' in css,
    'friday source': '1m0ufg4YR1cOgMjV8-HvYknvm8N00JXh7' in css,
    'publish order': manifest['grid']['publish_order'] == ['monday', 'wednesday', 'friday'],
    'display order': manifest['grid']['display_order'] == ['friday', 'wednesday', 'monday'],
}

failed = [name for name, ok in checks.items() if not ok]
for name, ok in checks.items():
    print(('PASS' if ok else 'FAIL'), name)

if failed:
    print('Parity smoke test failed: ' + ', '.join(failed), file=sys.stderr)
    raise SystemExit(1)

print('PARITY STRUCTURE: PASS')
