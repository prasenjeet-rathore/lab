import psycopg2
import os

# Use localhost if running from your terminal, or 'postgres' if running via podman exec
DB_HOST = os.getenv('DB_HOST', 'localhost') 

def seed_demo_data():
    conn = psycopg2.connect(
        host=DB_HOST,
        database="aml_validator_engine",
        user="user",
        password="password"
    )
    cur = conn.cursor()

    # 1. Ensure the profile table exists
    cur.execute("""
        CREATE TABLE IF NOT EXISTS customer_profiles (
            customer_id TEXT PRIMARY KEY,
            full_name TEXT,
            occupation TEXT,
            annual_income INT,
            risk_score FLOAT
        );
    """)

    # 2. Insert profiles for the IDs you saw in your SQL output earlier
    # We'll make '982' our "High Risk" star for the demo
    profiles = [
        ('982', 'John Doe', 'Student', 12000, 0.8),
        ('1107', 'Jane Smith', 'Software Engineer', 140000, 0.1),
        ('659', 'Bob Miller', 'Unemployed', 8000, 0.9),
        ('C1001', 'Mock Case', 'Retail Worker', 30000, 0.4) # To fix your button
    ]

    for p in profiles:
        cur.execute("""
            INSERT INTO customer_profiles (customer_id, full_name, occupation, annual_income, risk_score)
            VALUES (%s, %s, %s, %s, %s)
            ON CONFLICT (customer_id) DO UPDATE SET occupation = EXCLUDED.occupation;
        """, p)

    conn.commit()
    print("✅ Demo profiles seeded successfully!")
    cur.close()
    conn.close()

if __name__ == "__main__":
    seed_demo_data()