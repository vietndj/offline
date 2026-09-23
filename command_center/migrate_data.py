import json
import argparse
from pathlib import Path
from fedu_command_db import normalize_phone, upsert_contact, init_db

# File paths
STU_JSON = Path('/Users/vietmac/Documents/CODE/stu.fedu.vn/students.json')
RADAR_JSON = Path('/Users/vietmac/Documents/CODE/offline/telesale_radar/radar_cache.json')
LEADS_JSON = Path('/Users/vietmac/Documents/CODE/Quản gia/offline_leads.json')

def load_json(path):
    if not path.exists():
        return None
    with open(path, 'r', encoding='utf-8') as f:
        return json.load(f)

def map_radar_status(status):
    status_map = {
        'new': 'new',
        'contacted': 'contacted',
        'called': 'contacted',
        'negotiating': 'negotiating',
        'paid': 'enrolled'
    }
    return status_map.get(status, 'new')

def map_lead_status(status):
    status_map = {
        'pending': 'new',
        'approved': 'contacted'
    }
    return status_map.get(status, 'new')

def merge_dicts(base, update):
    """Merge update into base, taking the most complete fields."""
    for k, v in update.items():
        if v is not None and str(v).strip() != '':
            if k not in base or base[k] is None or str(base[k]).strip() == '':
                base[k] = v
            elif isinstance(v, list) and isinstance(base.get(k), list):
                # Merge lists uniquely
                for item in v:
                    if item not in base[k]:
                        base[k].append(item)
    return base

def main():
    parser = argparse.ArgumentParser(description="Migration script for FEDU Command Center")
    parser.add_argument('--dry-run', action='store_true', help="Print what would be done without writing to DB")
    args = parser.parse_args()

    init_db()

    stu_data = load_json(STU_JSON) or []
    radar_data = load_json(RADAR_JSON) or {}
    leads_data = load_json(LEADS_JSON) or {}

    contacts_map = {}
    stats = {
        'stu': 0,
        'radar': 0,
        'leads': 0,
        'duplicates_merged': 0
    }

    # 1. Process STU data
    for student in stu_data:
        phone = normalize_phone(student.get('phone'))
        if not phone:
            continue
        
        stage = 'new'
        # If class contains 'Offline'
        cls_name = student.get('class', '')
        if cls_name and 'Offline' in cls_name:
            stage = 'enrolled'

        notes = []
        if student.get('notes'):
            notes.append({"text": student.get('notes'), "source": "stu"})

        contact_data = {
            'phone': phone,
            'name': student.get('name'),
            'email': student.get('email'),
            'industry': student.get('industry'),
            'industry_slug': student.get('industry_slug'),
            'facebook_url': student.get('facebook_url'),
            'stage': stage,
            'class_name': cls_name,
            'completeness_score': student.get('completeness_score', 0),
            'notes': notes,
            'source': 'direct'
        }

        if phone in contacts_map:
            contacts_map[phone] = merge_dicts(contacts_map[phone], contact_data)
            stats['duplicates_merged'] += 1
        else:
            contacts_map[phone] = contact_data
        stats['stu'] += 1

    # 2. Process Radar data
    # radar_cache is a dict keyed by phone
    for raw_phone, data in radar_data.items():
        phone = normalize_phone(raw_phone)
        if not phone:
            continue
        
        status = data.get('status', 'new')
        stage = map_radar_status(status)

        notes = []
        if data.get('note'):
            notes.append({"text": data.get('note'), "source": "radar"})

        tags = data.get('tags', [])

        contact_data = {
            'phone': phone,
            'name': data.get('name'),
            'stage': stage,
            'notes': notes,
            'tags': tags,
            'source': 'facebook', # Assuming radar is mostly fb
            'radar_override': data
        }

        if phone in contacts_map:
            contacts_map[phone] = merge_dicts(contacts_map[phone], contact_data)
            stats['duplicates_merged'] += 1
        else:
            contacts_map[phone] = contact_data
        stats['radar'] += 1

    # 3. Process Leads data
    # offline_leads is a dict keyed by phone
    for raw_phone, data in leads_data.items():
        phone = normalize_phone(raw_phone)
        if not phone:
            continue

        stage = map_lead_status(data.get('status', 'pending'))

        notes = []
        if data.get('reason'):
            notes.append({"text": f"Reason: {data.get('reason')}", "source": "leads"})
        if data.get('suggestedScript'):
            notes.append({"text": f"Suggested Script: {data.get('suggestedScript')}", "source": "leads"})

        contact_data = {
            'phone': phone,
            'name': data.get('fullName'),
            'email': data.get('email'),
            'industry': data.get('occupation'),
            'stage': stage,
            'notes': notes,
            'source': 'form'
        }

        if phone in contacts_map:
            contacts_map[phone] = merge_dicts(contacts_map[phone], contact_data)
            stats['duplicates_merged'] += 1
        else:
            contacts_map[phone] = contact_data
        stats['leads'] += 1

    print(f"--- Migration Summary ---")
    print(f"STU Records Processed: {stats['stu']}")
    print(f"Radar Records Processed: {stats['radar']}")
    print(f"Leads Records Processed: {stats['leads']}")
    print(f"Duplicates Merged: {stats['duplicates_merged']}")
    print(f"Total Unique Contacts to Import: {len(contacts_map)}")

    if args.dry_run:
        print("\n--- DRY RUN: No data written to database ---")
        return

    print("\nStarting database import...")
    for phone, data in contacts_map.items():
        upsert_contact(**data)
    
    print("Migration completed successfully!")

if __name__ == '__main__':
    main()
