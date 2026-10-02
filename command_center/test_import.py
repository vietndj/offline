import sys
import os

sys.path.append("/Users/vietmac/Documents/CODE/antigravity-config-backup/config/skills/facebook-inbox-audit/scripts")
try:
    from phone_lead_dispatcher import check_phone_in_stu_and_called
    print("Import successful!")
    print(check_phone_in_stu_and_called("0916999522"))
except Exception as e:
    print(f"Error: {e}")
