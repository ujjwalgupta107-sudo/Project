import json
import random
from datetime import datetime, timedelta
import uuid

# Configuration
TOTAL_RECORDS = 500
CATEGORIES = {
    "DIGITAL_ARREST": 100,
    "UPI_PAYMENT": 60,
    "BANK_KYC": 50,
    "COURIER_CUSTOMS": 40,
    "TRAI_TELECOM": 35,
    "INVESTMENT": 30,
    "JOB_TASK": 25,
    "TECH_SUPPORT": 20,
    "LOTTERY_PRIZE": 20,
    "OTHER": 20,
    "BENIGN": 100
}

CITIES = ["Lucknow", "Kanpur", "Noida", "Ghaziabad", "Delhi", "Mumbai", "Pune", 
          "Bengaluru", "Hyderabad", "Chennai", "Kolkata", "Jaipur", "Ahmedabad", 
          "Bhopal", "Patna", "Chandigarh"]

# Shared Infrastructure Definitions
NETWORKS = {
    "NETWORK_ALPHA": {"count": 18, "type": "DIGITAL_ARREST", "cities": 4, "entities": [{"type": "UPI_ID", "val": "cbi.fictional@upi"}, {"type": "PHONE", "val": "91-98765-00001"}, {"type": "DOMAIN", "val": "fake-cbi.invalid"}]},
    "NETWORK_BETA": {"count": 15, "type": "COURIER_CUSTOMS", "cities": 3, "entities": [{"type": "PHONE", "val": "91-98765-00002"}, {"type": "UPI_ID", "val": "customs.fee@upi"}]},
    "NETWORK_GAMMA": {"count": 14, "type": "BANK_KYC", "cities": 5, "entities": [{"type": "DOMAIN", "val": "verify-kyc-bank.invalid"}, {"type": "PHONE", "val": "91-98765-00003"}]},
    "NETWORK_DELTA": {"count": 12, "type": "INVESTMENT", "cities": 4, "entities": [{"type": "EMAIL", "val": "admin@trade-fake.invalid"}, {"type": "DOMAIN", "val": "trade-fake.invalid"}]},
    "NETWORK_EPSILON": {"count": 10, "type": "JOB_TASK", "cities": 3, "entities": [{"type": "UPI_ID", "val": "task-pay@upi"}]},
    "NETWORK_ZETA": {"count": 10, "type": "DIGITAL_ARREST", "cities": 5, "entities": [{"type": "BANK_ACCOUNT", "val": "BANK9876543210"}, {"type": "PHONE", "val": "91-98765-00004"}]},
    "NETWORK_ETA": {"count": 8, "type": "TRAI_TELECOM", "cities": 3, "entities": [{"type": "PHONE", "val": "91-98765-00005"}]},
    "NETWORK_THETA": {"count": 8, "type": "UPI_PAYMENT", "cities": 4, "entities": [{"type": "UPI_ID", "val": "refund.test@upi"}]},
    "NETWORK_IOTA": {"count": 7, "type": "TECH_SUPPORT", "cities": 2, "entities": [{"type": "DOMAIN", "val": "fake-support.invalid"}]},
    "NETWORK_KAPPA": {"count": 6, "type": "INVESTMENT", "cities": 3, "entities": [{"type": "EMAIL", "val": "invest@wealth-fake.invalid"}]},
    "NETWORK_LAMBDA": {"count": 6, "type": "DIGITAL_ARREST", "cities": 2, "entities": [{"type": "UPI_ID", "val": "police.fine@upi"}, {"type": "PHONE", "val": "91-98765-00006"}]},
    "NETWORK_MU": {"count": 5, "type": "COURIER_CUSTOMS", "cities": 3, "entities": [{"type": "PHONE", "val": "91-98765-00007"}]}
}

LANGUAGES = [("en", 0.65), ("hinglish", 0.25), ("hi", 0.10)]

def get_language():
    r = random.random()
    if r < 0.65: return "en"
    if r < 0.90: return "hinglish"
    return "hi"

def format_entity(ent_type, canonical):
    val = canonical
    fmt_choice = random.choice([1, 2, 3])
    if ent_type == "PHONE":
        base = val.replace("91-", "")
        if fmt_choice == 1: return f"+91 {base[:5]} {base[5:]}"
        elif fmt_choice == 2: return f"+91{base}"
        else: return f"91-{base[:5]}-{base[5:]}"
    elif ent_type == "UPI_ID":
        if fmt_choice == 1: return val.lower()
        elif fmt_choice == 2: return val.upper()
        else: return f" {val.lower()} "
    elif ent_type == "EMAIL":
        if fmt_choice == 1: return val.lower()
        elif fmt_choice == 2: return val.upper()
        else: return val.lower()
    return val

import string
def generate_message(category, lang, network=None):
    # This is a simplified generator. In a real script, we'd have robust templates.
    templates = {
        "DIGITAL_ARREST": [
            "This is CBI. Your Aadhaar is linked to illegal parcel. Transfer 50000 to {e0} or face digital arrest. Call {e1} or visit {e2}",
            "Customs officer here. Drugs found in your courier. Send fee to {e0}. Contact {e1}",
            "ED notice. Money laundering detected in your account. Transfer to safe account {e0}. Call {e1}",
            "Police warrant issued. Do not tell your family. Verification fee required at {e0}.",
            "Video call interrogation required for illegal parcel. Pay {e0} and call {e1}."
        ],
        "BENIGN": [
            "Hey, just checking in to see if you want to get lunch later today.",
            "Can you send me the college assignment?",
            "Your appointment is confirmed for tomorrow at 10 AM.",
            "Delivery update: Your package will arrive by 9 PM today.",
            "Meeting rescheduled to 4 PM. See you then.",
            "Did you talk to mom about the trip?",
            "Happy birthday! Hope you have a great day.",
            "Transaction successful for Rs 500 to merchant.",
            "Flight to Mumbai is on time.",
            "Don't forget the event this weekend."
        ],
        # Add a few basic templates for others
        "UPI_PAYMENT": ["Fake refund received. Scan QR or pay {e0} to receive cashback."],
        "BANK_KYC": ["Bank KYC expired. Update at {e0} or call {e1} to avoid account freeze."],
        "COURIER_CUSTOMS": ["Illegal parcel seized by customs. Call {e0} or pay {e1} to clear."],
        "TRAI_TELECOM": ["TRAI notice: SIM disconnection in 24 hours. Call {e0} to stop."],
        "INVESTMENT": ["Double your money in 10 days! Visit {e0} or email {e1} for stock tips."],
        "JOB_TASK": ["Earn 5000 per day working from home. Pay joining fee to {e0}."],
        "TECH_SUPPORT": ["Device compromised! Call fake bank support {e0} or install remote app from {e1}."],
        "LOTTERY_PRIZE": ["You won a lottery of 1 Crore! Pay processing fee to {e0}."],
        "OTHER": ["Generic scam request. Send money to {e0} or call {e1}."]
    }
    
    cat_templates = templates.get(category, templates.get("OTHER"))
    tmpl = random.choice(cat_templates)
    
    ents = []
    if network and network in NETWORKS:
        ents = NETWORKS[network]["entities"]
    else:
        # Generate some random entities for non-network scams if needed, but not required to be shared.
        if category != "BENIGN":
            ents = [{"type": "UPI_ID", "val": f"scammer{random.randint(100,999)}@upi"}]
            
    fmt_ents = [format_entity(e["type"], e["val"]) for e in ents]
    
    # Fill placeholders
    msg = tmpl
    for i, e in enumerate(fmt_ents):
        msg = msg.replace(f"{{e{i}}}", e)
        
    # Clean up unused placeholders
    import re
    msg = re.sub(r'\{e\d\}', '', msg)
    
    # Language variations
    if lang == "hinglish" and category != "BENIGN":
        msg = msg.replace("Transfer", "Bhejo").replace("Call", "Call karo").replace("money", "paisa")
    elif lang == "hi" and category != "BENIGN":
        msg = msg.replace("This is CBI", "CBI se bol raha hu").replace("Transfer", "Bhejiye")
        
    # Random noise
    if random.random() < 0.3:
        msg = msg.lower()
    if random.random() < 0.2:
        msg += " URGENT!!!"
        
    return msg, ents

records = []
external_id_counter = 1

def generate_record(category, network=None, cities_subset=None):
    global external_id_counter
    lang = get_language()
    
    if cities_subset:
        city = random.choice(cities_subset)
    else:
        city = random.choice(CITIES)
        
    msg, ents = generate_message(category, lang, network)
    
    # Date logic
    days_ago = random.randint(1, 180)
    reported_at = (datetime.utcnow() - timedelta(days=days_ago)).isoformat() + "Z"
    
    record = {
        "external_id": f"KAVACH-SYN-{external_id_counter:04d}",
        "message_text": msg.strip(),
        "ground_truth_label": "BENIGN" if category == "BENIGN" else "SCAM",
        "ground_truth_category": category,
        "language": lang,
        "city": city,
        "state": "TestState",
        "reported_at": reported_at,
        "source_channel": random.choice(["SMS", "WHATSAPP", "CALL_TRANSCRIPT", "EMAIL"]),
        "network_id": network,
        "expected_shared_entities": [{"type": e["type"], "value": e["val"]} for e in ents] if network else [],
        "expected_risk_band": "LOW" if category == "BENIGN" else random.choice(["MEDIUM", "HIGH", "CRITICAL"]),
        "synthetic": True
    }
    external_id_counter += 1
    return record

# Generate networks first
for net_id, net_info in NETWORKS.items():
    cities_subset = random.sample(CITIES, net_info["cities"])
    for _ in range(net_info["count"]):
        records.append(generate_record(net_info["type"], net_id, cities_subset))
        CATEGORIES[net_info["type"]] -= 1

# Generate remaining
for cat, count in CATEGORIES.items():
    for _ in range(count):
        records.append(generate_record(cat))

random.shuffle(records)

with open("kavach_synthetic_cases.jsonl", "w") as f:
    for r in records:
        f.write(json.dumps(r) + "\n")

print(f"Generated {len(records)} records.")

# Validations
assert len(records) == 500, "Must be exactly 500 records"
ext_ids = [r["external_id"] for r in records]
assert len(set(ext_ids)) == 500, "External IDs must be unique"
benign = [r for r in records if r["ground_truth_label"] == "BENIGN"]
assert len(benign) == 100, "Must be exactly 100 benign records"
net_ids = set([r["network_id"] for r in records if r["network_id"]])
assert len(net_ids) == 12, "Must be exactly 12 networks"
for b in benign:
    assert b["network_id"] is None, "Benign must have null network"
for r in records:
    assert r["synthetic"] is True, "Must be synthetic"
    assert r["message_text"], "Message text cannot be empty"

print("All validations passed.")
