from pathlib import Path

import fitz


source = Path("attached_assets/0_Programming-ArtificialIntelligence-Ar-EB-part1_1792460828876.pdf")
output = Path(".agents/outputs/unit1-inspection")
output.mkdir(parents=True, exist_ok=True)

document = fitz.open(source)
print(f"pages={document.page_count}")

unit_start, unit_end = 4, 31  # zero-based: printed pages 4–30, before chapter 2
text_parts = []
for index in range(unit_start, unit_end):
    page = document.load_page(index)
    text_parts.append(f"\n\n===== PDF PAGE {index + 1} =====\n{page.get_text()}")
    compact = " ".join(page.get_text().split())
    print(f"\n--- PDF page {index + 1} ---\n{compact[:1800]}")
(output / "unit1.txt").write_text("".join(text_parts), encoding="utf-8")

render_pages = {4, 5, 8, 12, 13, 16, 18, 19, 23, 24, 25, 28, 29, 30}

for index in sorted(render_pages):
    page = document.load_page(index)
    image = page.get_pixmap(matrix=fitz.Matrix(1.5, 1.5), alpha=False)
    image.save(output / f"page-{index + 1:03}.png")

print(f"\nrendered_pages={','.join(str(i + 1) for i in sorted(render_pages))}")
