import ast
import struct
from pathlib import Path


def parse_po(path):
    messages = {}
    msgid = None
    msgstr = None
    active = None

    for raw_line in path.read_text(encoding="utf-8").splitlines():
        line = raw_line.strip()
        if not line or line.startswith("#"):
            continue
        if line.startswith("msgid "):
            if msgid is not None:
                messages[msgid] = msgstr or ""
            msgid = ast.literal_eval(line[6:])
            msgstr = ""
            active = "msgid"
            continue
        if line.startswith("msgstr "):
            msgstr = ast.literal_eval(line[7:])
            active = "msgstr"
            continue
        if line.startswith('"') and active == "msgid":
            msgid += ast.literal_eval(line)
        elif line.startswith('"') and active == "msgstr":
            msgstr += ast.literal_eval(line)

    if msgid is not None:
        messages[msgid] = msgstr or ""
    return messages


def write_mo(messages, output):
    ids = sorted(messages)
    encoded_ids = [msgid.encode("utf-8") for msgid in ids]
    encoded_strings = [messages[msgid].encode("utf-8") for msgid in ids]
    count = len(ids)
    keystart = 7 * 4 + count * 16
    valuestart = keystart + sum(len(msgid) + 1 for msgid in encoded_ids)

    key_offsets = []
    offset = keystart
    for msgid in encoded_ids:
        key_offsets.append((len(msgid), offset))
        offset += len(msgid) + 1

    value_offsets = []
    offset = valuestart
    for msgstr in encoded_strings:
        value_offsets.append((len(msgstr), offset))
        offset += len(msgstr) + 1

    output.parent.mkdir(parents=True, exist_ok=True)
    with output.open("wb") as mo:
        mo.write(struct.pack("Iiiiiii", 0x950412DE, 0, count, 7 * 4, 7 * 4 + count * 8, 0, 0))
        for length, offset in key_offsets:
            mo.write(struct.pack("ii", length, offset))
        for length, offset in value_offsets:
            mo.write(struct.pack("ii", length, offset))
        for msgid in encoded_ids:
            mo.write(msgid + b"\0")
        for msgstr in encoded_strings:
            mo.write(msgstr + b"\0")


def main():
    root = Path(__file__).resolve().parents[1] / "backend" / "locale"
    for po_path in root.glob("*/LC_MESSAGES/django.po"):
        write_mo(parse_po(po_path), po_path.with_suffix(".mo"))


if __name__ == "__main__":
    main()
