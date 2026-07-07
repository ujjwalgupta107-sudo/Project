# KAVACH AI Synthetic Dataset Summary

**Disclaimer: This dataset is entirely synthetic and fictional, created exclusively for software testing and demonstration purposes. No real victims, active personal identifiers, or actual police complaints are included.**

## 1. Record Count
Total records generated: 500

## 2. Category Distribution
- DIGITAL_ARREST: 100
- UPI_PAYMENT: 60
- BANK_KYC: 50
- COURIER_CUSTOMS: 40
- TRAI_TELECOM: 35
- INVESTMENT: 30
- JOB_TASK: 25
- TECH_SUPPORT: 20
- LOTTERY_PRIZE: 20
- OTHER: 20
- BENIGN: 100

## 3. Language Distribution
- English (~65%)
- Hinglish (~25%)
- Hindi (~10%)

## 4. Geographic Distribution
Reports are spread across cities such as Lucknow, Kanpur, Noida, Ghaziabad, Delhi, Mumbai, Pune, Bengaluru, Hyderabad, Chennai, Kolkata, Jaipur, Ahmedabad, Bhopal, Patna, and Chandigarh.

## 5. Risk-Band Distribution
Risk scores were randomly distributed (LOW for BENIGN; and randomly among MEDIUM, HIGH, CRITICAL for SCAM) to ensure varying alert triggers.

## 6. Source-Channel Distribution
Channels: SMS, WHATSAPP, CALL_TRANSCRIPT, EMAIL

## 7. Connected Fraud Networks
12 fictional fraud networks were created, varying by scam type and shared entities, to test graph and dynamic clustering logic. 
- **NETWORK_ALPHA**: 18 cases; DIGITAL_ARREST; 4 cities; Shared UPI, Phone, Domain.
- **NETWORK_BETA**: 15 cases; COURIER_CUSTOMS; 3 cities; Shared Phone, UPI.
- **NETWORK_GAMMA**: 14 cases; BANK_KYC; 5 cities; Shared Domain, Phone.
- **NETWORK_DELTA**: 12 cases; INVESTMENT; 4 cities; Shared Email, Domain.
- **NETWORK_EPSILON**: 10 cases; JOB_TASK; 3 cities; Shared UPI.
- **NETWORK_ZETA**: 10 cases; DIGITAL_ARREST; 5 cities; Shared Bank Account, Phone.
- **NETWORK_ETA**: 8 cases; TRAI_TELECOM; 3 cities; Shared Phone.
- **NETWORK_THETA**: 8 cases; UPI_PAYMENT; 4 cities; Shared UPI.
- **NETWORK_IOTA**: 7 cases; TECH_SUPPORT; 2 cities; Shared Domain.
- **NETWORK_KAPPA**: 6 cases; INVESTMENT; 3 cities; Shared Email.
- **NETWORK_LAMBDA**: 6 cases; DIGITAL_ARREST; 2 cities; Shared UPI and Phone.
- **NETWORK_MU**: 5 cases; COURIER_CUSTOMS; 3 cities; Shared Phone.

## 8. Entity Types & Normalization
Extracted Entities Include: UPI_ID, PHONE, BANK_ACCOUNT, DOMAIN, EMAIL.
Safe formatting variations were randomly introduced to test normalization logic:
- Phones formatted as +91 XXXXX XXXXX, +91XXXXXXXXXX, or 91-XXXXX-XXXXX.
- UPI IDs and emails occasionally contained uppercase characters or padded whitespace.
