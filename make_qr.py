#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Script tạo 4 mã QR cho Thiệp 20/11
Sử dụng:
    python make_qr.py https://ten-mien-cua-toi/thiep-20-11
    python make_qr.py https://ten-mien-cua-toi/thiep-20-11 --den
"""

import sys
import os

try:
    import qrcode
    from PIL import Image
except ImportError:
    print("Vui lòng cài đặt thư viện trước bằng lệnh:")
    print('  pip install "qrcode[pil]"')
    sys.exit(1)

# Danh sách 4 trang con cần sinh mã QR
PAGES = [
    {
        "filename": "loi-cam-on.png",
        "path": "noidung/loi-cam-on.html",
        "label": "Lời cảm ơn"
    },
    {
        "filename": "thong-diep.png",
        "path": "noidung/thong-diep.html",
        "label": "Thông điệp"
    },
    {
        "filename": "nguon-tham-khao.png",
        "path": "noidung/nguon-tham-khao.html",
        "label": "Nguồn tham khảo"
    },
    {
        "filename": "bang-phan-cong.png",
        "path": "noidung/bang-phan-cong.html",
        "label": "Bảng phân công"
    }
]


def generate_single_qr(url, output_path, fill_color="#1e63d6", back_color="#ffffff"):
    """Tạo 1 mã QR chuẩn: error_correction H, box_size 20, border 4."""
    qr = qrcode.QRCode(
        version=None,
        error_correction=qrcode.constants.ERROR_CORRECT_H,
        box_size=20,
        border=4,
    )
    qr.add_data(url)
    qr.make(fit=True)

    img = qr.make_image(fill_color=fill_color, back_color=back_color).convert("RGB")
    os.makedirs(os.path.dirname(output_path), exist_ok=True)
    img.save(output_path)


def generate_all_qrs(base_url, output_dir=None, is_black=False):
    # Loại bỏ dấu / ở cuối URL nếu có
    clean_base_url = base_url.rstrip("/")
    script_dir = os.path.dirname(os.path.abspath(__file__))

    # Xác định thư mục đầu ra
    if output_dir is None:
        target_folder = "assets/qr-den" if is_black else "assets/qr"
        out_path = os.path.join(script_dir, target_folder)
    else:
        out_path = output_dir

    fill_color = "#000000" if is_black else "#1e63d6"
    theme_name = "đen thuần (#000000)" if is_black else "xanh dương (#1e63d6)"

    print(f"--- Bắt đầu sinh 4 mã QR ({theme_name}) ---")
    print(f"Địa chỉ gốc (BASE_URL): {clean_base_url}")
    print(f"Thư mục lưu: {out_path}\n")

    created_files = []
    for page in PAGES:
        full_url = f"{clean_base_url}/{page['path']}"
        file_dest = os.path.join(out_path, page["filename"])
        generate_single_qr(full_url, file_dest, fill_color=fill_color, back_color="#ffffff")
        created_files.append((page["label"], file_dest, full_url))
        print(f"✅ [{page['label']}]: {full_url} -> {file_dest}")

    print(f"\nHoàn tất! Đã tạo thành công {len(created_files)} mã QR.")
    return created_files


if __name__ == "__main__":
    args = sys.argv[1:]
    if not args:
        print("Sử dụng: python make_qr.py <BASE_URL> [--den]")
        print("Ví dụ:   python make_qr.py https://thiep-20-11.netlify.app")
        print("         python make_qr.py https://thiep-20-11.netlify.app --den")
        sys.exit(1)

    is_black_mode = "--den" in args
    url_candidates = [a for a in args if not a.startswith("--")]

    if not url_candidates:
        print("Lỗi: Vui lòng cung cấp đường dẫn BASE_URL!")
        sys.exit(1)

    input_url = url_candidates[0].strip()
    generate_all_qrs(input_url, is_black=is_black_mode)
