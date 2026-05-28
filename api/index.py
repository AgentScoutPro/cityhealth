import sqlite3
import json
from contextlib import contextmanager
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional

app = FastAPI(title="COD3AI SEO Audit API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3737"],
    allow_methods=["GET", "PATCH"],
    allow_headers=["*"],
)

DB_PATH = "audit.db"


# ── DB helpers ──────────────────────────────────────────────────────────────

@contextmanager
def get_db():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    try:
        yield conn
    finally:
        conn.close()


def init_db():
    with get_db() as conn:
        conn.executescript("""
            CREATE TABLE IF NOT EXISTS audits (
                id INTEGER PRIMARY KEY,
                site_url TEXT NOT NULL,
                site_name TEXT NOT NULL,
                audit_date TEXT NOT NULL,
                score INTEGER NOT NULL,
                grade TEXT NOT NULL,
                category TEXT NOT NULL
            );
            CREATE TABLE IF NOT EXISTS issues (
                id INTEGER PRIMARY KEY,
                audit_id INTEGER NOT NULL,
                category TEXT NOT NULL,
                title TEXT NOT NULL,
                priority TEXT NOT NULL,
                impact TEXT,
                evidence TEXT,
                fix TEXT,
                FOREIGN KEY (audit_id) REFERENCES audits(id)
            );
            CREATE TABLE IF NOT EXISTS passing_checks (
                id INTEGER PRIMARY KEY,
                audit_id INTEGER NOT NULL,
                title TEXT NOT NULL,
                FOREIGN KEY (audit_id) REFERENCES audits(id)
            );
            CREATE TABLE IF NOT EXISTS action_items (
                id INTEGER PRIMARY KEY,
                audit_id INTEGER NOT NULL,
                phase INTEGER NOT NULL,
                phase_label TEXT NOT NULL,
                title TEXT NOT NULL,
                description TEXT NOT NULL,
                effort TEXT NOT NULL,
                completed INTEGER NOT NULL DEFAULT 0,
                FOREIGN KEY (audit_id) REFERENCES audits(id)
            );
            CREATE TABLE IF NOT EXISTS schema_types (
                id INTEGER PRIMARY KEY,
                audit_id INTEGER NOT NULL,
                name TEXT NOT NULL,
                icon TEXT NOT NULL,
                status TEXT NOT NULL,
                note TEXT NOT NULL,
                FOREIGN KEY (audit_id) REFERENCES audits(id)
            );
            CREATE TABLE IF NOT EXISTS meta_pages (
                id INTEGER PRIMARY KEY,
                audit_id INTEGER NOT NULL,
                url TEXT NOT NULL,
                current_desc TEXT,
                current_chars INTEGER,
                suggested_desc TEXT NOT NULL,
                suggested_chars INTEGER NOT NULL,
                issues TEXT NOT NULL,
                FOREIGN KEY (audit_id) REFERENCES audits(id)
            );
        """)
        conn.commit()
        _seed(conn)


def _seed(conn: sqlite3.Connection):
    if conn.execute("SELECT COUNT(*) FROM audits").fetchone()[0] > 0:
        return

    conn.execute("""INSERT INTO audits VALUES
        (1,'https://cityhealthaz.com','City Health Services','2026-05-27',64,'Fair','Pain Management')""")

    issues = [
        # (audit_id, category, title, priority, impact, evidence, fix)
        # ── Critical ──────────────────────────────────────────────────────────
        (1,"local","No MedicalClinic / LocalBusiness schema on location pages","critical",
         "Zero local pack signal from structured data; Google cannot confirm NAP",
         "HTML source on /locations/longmore-road-mesa-az/ and /locations/power-road-mesa-az/ shows no JSON-LD with address, phone, or hours",
         "Add MedicalClinic JSON-LD to both location pages via Yoast Custom Schema field"),
        (1,"schema","Schema @type is Organization not MedicalClinic","critical",
         "Organization schema has no address, phone, hours — zero local SEO value on location pages",
         "Sitewide JSON-LD still uses @type: Organization with no NAP data (verified May 27 2026)",
         "Override Yoast on location pages with MedicalClinic schema including full NAP and openingHours"),
        (1,"schema","No Person/Physician schema on About page","critical",
         "Important E-E-A-T signal for a YMYL medical site; ranks below competitors who have it",
         "About page lists Brad Forbes DC, Dr. Ana Garcia, Terri Caruso AGACNP-C — none have Person schema",
         "Add Person schema for each provider with name, jobTitle, medicalSpecialty, and image"),
        # ── High ──────────────────────────────────────────────────────────────
        (1,"technical","Viewport disables user zoom (user-scalable=0)","high",
         "Google flags as Mobile Usability error in Search Console; ADA accessibility violation",
         "<meta name=viewport content='…maximum-scale=1,user-scalable=0'>",
         "Edit Salient theme viewport setting — remove user-scalable=0, change maximum-scale to 5"),
        (1,"technical","Duplicate terms pages without canonical resolution","high",
         "Duplicate content signal; wastes crawl budget",
         "/terms-and-conditions/ and /terms-conditions/ both in sitemap with identical content",
         "Keep /terms-and-conditions/, 301 redirect /terms-conditions/, remove duplicate from sitemap"),
        (1,"onpage","Homepage H1 uses 'Near Me' phrase (over-optimization)","high",
         "Can appear spammy; Google understands proximity from GBP and NAP without the phrase",
         "H1: 'Best Pain Management Clinic Near Me in Mesa' (verified May 27 2026)",
         "Change to: Pain Management Clinic in Mesa, AZ"),
        (1,"onpage","Images missing descriptive alt text sitewide","high",
         "Affects accessibility (ADA) and image search traffic",
         "All pages audited returned images with no alt attribute or generic placeholder values",
         "Bulk update via WordPress Media Library with descriptive, location-aware alt text"),
        (1,"local","Power Road page footer shows both location addresses","high",
         "Mixed NAP signals suppress local pack rankings for both locations",
         "Footer on /locations/power-road-mesa-az/ displays both Power Rd and Longmore addresses (verified May 27 2026)",
         "Use conditional footer logic to show only the relevant location address per page"),
        (1,"content","About page undersells credentials for a medical practice","high",
         "YMYL pages judged heavily on E-E-A-T; thin about pages directly affect rankings",
         "~550 words; Dr. Garcia listed only as 'Bilingual - Spanish'; no education, certifications, or specialty detail",
         "Add individual provider bios with specialty, education, years of experience, accreditations, photos"),
        (1,"meta","Power Road meta description not set","high",
         "Google will auto-generate snippet from random page text, reducing CTR",
         "No <meta name=description> tag on /locations/power-road-mesa-az/ (verified May 27 2026)",
         "City Health Services on Power Rd, Mesa AZ treats pain, neuropathy & injuries. Book your visit today."),
        # ── Medium ────────────────────────────────────────────────────────────
        (1,"local","Location page title tags use unnatural phrasing","medium",
         "Nobody searches 'pain management in Longmore Road' — misses real queries",
         "Title: 'Pain Management Specialist in Longmore Road Mesa, AZ' (verified May 27 2026)",
         "Longmore: Pain Management Clinic in Mesa, AZ (Longmore Rd) | City Health Services"),
        (1,"content","59 blog posts with bulk-updated dates suggest mass AI refresh","medium",
         "Scaled refreshes without substantive improvement can trigger scaled content abuse policy",
         "Sitemap last-modified 2026-05-25; 48 of 59 posts previously shared exact date 2025-09-18",
         "Audit top 15 posts in Search Console, do real rewrites with original data and FAQs"),
        (1,"content","Legal entity name discrepancy on terms page","medium",
         "Brand consistency is a trust signal; old entity name confuses visitors and search engines",
         "Terms page references 'Fiesta Health Services LLC d/b/a City Health Services'",
         "Clean up all references to the former entity name across the site"),
        (1,"meta","Homepage meta description is weak copy","medium",
         "Vague copy with no location or services reduces CTR from search results",
         "Current: 'Known over the years as the best place... But we also have more! Check us out today.'",
         "Pain management, neuropathy treatment & physical therapy in Mesa, AZ. Two locations. Personalized care from a team of doctors, chiropractors & therapists."),
        (1,"meta","Location page meta descriptions are generic","medium",
         "No specific services, weak CTAs lower click-through rate",
         "Longmore: 'City Health Services in Longmore Road, Mesa, AZ, offers expert medical care... Trust us and thrive!' (118 chars)",
         "City Health Services on Longmore Rd, Mesa AZ offers pain management, neuropathy treatment & chiropractic care. Call 480-649-5297 or book online today."),
        # ── Low ───────────────────────────────────────────────────────────────
        (1,"meta","Neuropathy page meta description slightly over 160 chars","low",
         "May be truncated in search results reducing CTR",
         "168 characters — ends with '...designed to restore your health and well-being'",
         "Trim to: Suffering from neuropathy in Mesa, AZ? City Health Services offers RST-Sanexas treatment & custom plans. Book a consultation today."),
    ]
    conn.executemany(
        "INSERT INTO issues(audit_id,category,title,priority,impact,evidence,fix) VALUES(?,?,?,?,?,?,?)",
        issues
    )

    passing = [
        "HTTPS / valid SSL certificate",
        "robots.txt exists with sitemap reference",
        "XML sitemap index — Yoast-generated, last updated 2026-05-25",
        "Canonical tags present on all pages (Yoast)",
        "Meta robots: index, follow, max-image-preview:large, max-snippet:-1",
        "Open Graph tags present (og:title, og:description, og:url)",
        "Twitter card: summary_large_image",
        "Google Tag Manager installed",
        "Breadcrumb schema correct on all pages",
        # ── Newly fixed since May 23 2026 audit ──
        "Location URL slugs corrected — /mesa-az/ live, 301 redirects from /meza-az/ paths",
        "robots.txt: wildcard query-string block removed (Disallow: /*? gone)",
        "robots.txt: Crawl-delay directive removed",
        "Location page H1s now include medical keyword 'Pain Management Clinic'",
    ]
    conn.executemany(
        "INSERT INTO passing_checks(audit_id,title) VALUES(1,?)",
        [(p,) for p in passing]
    )

    schema_types = [
        ("MedicalClinic","🏥","missing","Required on both location pages for local pack eligibility"),
        ("Organization","🏢","partial","Present via Yoast but no address, phone, or hours"),
        ("BreadcrumbList","🍞","present","Correct hierarchy on all pages via Yoast"),
        ("WebSite + SearchAction","🌐","present","Sitelinks search box eligible"),
        ("Person / Physician","👤","missing","No schema on About page for providers — important for E-E-A-T"),
        ("FAQPage","❓","missing","No FAQ sections on service pages — big rich result opportunity"),
    ]
    conn.executemany(
        "INSERT INTO schema_types(audit_id,name,icon,status,note) VALUES(1,?,?,?,?)",
        schema_types
    )

    meta_pages = [
        (1, "cityhealthaz.com/",
         "Known over the years as the best place to choose if you're looking for a pain management clinic. But we also have more! Check us out today.",
         149,
         "Pain management, neuropathy treatment & physical therapy in Mesa, AZ. Two locations. Personalized care from a team of doctors, chiropractors & therapists.",
         157,
         "No city name · 'But we also have more!' says nothing · Generic CTA"),
        (1, "cityhealthaz.com/locations/longmore-road-mesa-az/",
         "City Health Services in Longmore Road, Mesa, AZ, offers expert medical care and wellness solutions. Trust us for your health needs and thrive!",
         118,
         "City Health Services on Longmore Rd, Mesa AZ offers pain management, neuropathy treatment & chiropractic care. Call 480-649-5297 or book online today.",
         155,
         "No specific services · 'Thrive!' is fluffy · Too short"),
        (1, "cityhealthaz.com/locations/power-road-mesa-az/",
         None, None,
         "City Health Services on Power Rd, Mesa AZ treats pain, neuropathy & injuries with expert medical, chiropractic & physical therapy. Book your visit today.",
         153,
         "Missing — Google will pull random text from the page"),
        (1, "cityhealthaz.com/services/neuropathy-treatment/",
         "City Health Services specializes in neuropathy treatment and nerve damage treatment. Book now and experience personalized nerve damage therapy designed to restore your health and well-being.",
         168,
         "Suffering from neuropathy in Mesa, AZ? City Health Services offers RST-Sanexas nerve treatment & customized plans. Book a consultation today.",
         143,
         "Over 160 chars · Vague ending phrase"),
    ]
    conn.executemany(
        "INSERT INTO meta_pages(audit_id,url,current_desc,current_chars,suggested_desc,suggested_chars,issues) VALUES(?,?,?,?,?,?,?)",
        meta_pages
    )

    action_items = [
        # Phase 1 — This Week
        (1,1,"This Week","Add MedicalClinic JSON-LD to both location pages",
         "Use ready-to-paste schema from the Schema tab. Add via Yoast Custom Schema or Custom HTML block.","~45 min"),
        (1,1,"This Week","Fix Power Road footer — show only Power Rd address",
         "Remove Longmore Rd address from Power Road location page footer to eliminate mixed NAP signal.","~15 min"),
        (1,1,"This Week","Canonical/redirect duplicate terms pages",
         "Keep /terms-and-conditions/, 301 redirect /terms-conditions/, remove duplicate from sitemap.","~10 min"),
        (1,1,"This Week","Rewrite homepage meta description",
         "See Meta Descriptions tab for suggested copy (157 chars). Targets Mesa AZ + services + two locations.","~5 min"),
        # Phase 2 — Weeks 2–4
        (1,2,"Weeks 2–4","Fix viewport tag — remove user-scalable=0",
         "Edit Salient theme settings or add PHP override. Fixes Google Mobile Usability error in Search Console.","~15 min"),
        (1,2,"Weeks 2–4","Rewrite homepage H1 — remove 'Near Me' phrase",
         "Change H1 from 'Best Pain Management Clinic Near Me in Mesa' to 'Pain Management Clinic in Mesa, AZ'.","~5 min"),
        (1,2,"Weeks 2–4","Rewrite location page meta descriptions",
         "See Meta Descriptions tab for both Longmore and Power Road copy. Power Road currently has no meta description set.","~10 min"),
        (1,2,"Weeks 2–4","Bulk-add alt text to all images",
         "WordPress Media Library → update each image alt text with descriptive, location-aware copy.","~2 hrs"),
        (1,2,"Weeks 2–4","Expand About page with provider bios + credentials",
         "Full bios for Forbes DC, Dr. Garcia, Caruso AGACNP-C with specialty, education, experience. Add Person schema for each.","~3 hrs"),
        # Phase 3 — Months 1–3
        (1,3,"Months 1–3","Create location-specific service pages",
         "e.g. 'Neuropathy Treatment Mesa AZ', 'Medical Weight Loss Mesa AZ' — expands local keyword footprint.","~2 days"),
        (1,3,"Months 1–3","Add FAQ sections + FAQPage schema to top 5 service pages",
         "Targets long-tail voice/AI search + enables FAQ rich results in SERPs.","~1 day"),
        (1,3,"Months 1–3","Audit + substantively update top 15 blog posts",
         "Use Search Console for highest-traffic posts. Real rewrites with original data and FAQs — not date bumps.","~1 week"),
        (1,3,"Months 1–3","Create dedicated Insurances Accepted page",
         "Targets queries like 'does [insurance] cover pain management Mesa AZ'.","~2 hrs"),
        (1,3,"Months 1–3","Run full PageSpeed audit + fix Core Web Vitals",
         "Run PageSpeed Insights for mobile + desktop. Address LCP, INP, and CLS scores.","varies"),
    ]
    conn.executemany(
        "INSERT INTO action_items(audit_id,phase,phase_label,title,description,effort) VALUES(?,?,?,?,?,?)",
        action_items
    )

    conn.commit()


# ── Models ───────────────────────────────────────────────────────────────────

class ActionItemPatch(BaseModel):
    completed: bool


# ── Routes ───────────────────────────────────────────────────────────────────

@app.get("/api/audit/{audit_id}")
def get_audit(audit_id: int):
    with get_db() as conn:
        row = conn.execute("SELECT * FROM audits WHERE id=?", (audit_id,)).fetchone()
        if not row:
            raise HTTPException(404, "Audit not found")
        return dict(row)


@app.get("/api/audit/{audit_id}/summary")
def get_summary(audit_id: int):
    with get_db() as conn:
        issues = conn.execute(
            "SELECT priority, COUNT(*) as cnt FROM issues WHERE audit_id=? GROUP BY priority",
            (audit_id,)
        ).fetchall()
        passing = conn.execute(
            "SELECT COUNT(*) as cnt FROM passing_checks WHERE audit_id=?", (audit_id,)
        ).fetchone()["cnt"]
        counts = {r["priority"]: r["cnt"] for r in issues}
        return {
            "critical": counts.get("critical", 0),
            "high": counts.get("high", 0),
            "medium": counts.get("medium", 0),
            "low": counts.get("low", 0),
            "passing": passing,
        }


@app.get("/api/audit/{audit_id}/issues")
def get_issues(audit_id: int, category: Optional[str] = None):
    with get_db() as conn:
        if category:
            rows = conn.execute(
                "SELECT * FROM issues WHERE audit_id=? AND category=? ORDER BY CASE priority WHEN 'critical' THEN 1 WHEN 'high' THEN 2 WHEN 'medium' THEN 3 ELSE 4 END",
                (audit_id, category)
            ).fetchall()
        else:
            rows = conn.execute(
                "SELECT * FROM issues WHERE audit_id=? ORDER BY CASE priority WHEN 'critical' THEN 1 WHEN 'high' THEN 2 WHEN 'medium' THEN 3 ELSE 4 END",
                (audit_id,)
            ).fetchall()
        return [dict(r) for r in rows]


@app.get("/api/audit/{audit_id}/passing")
def get_passing(audit_id: int):
    with get_db() as conn:
        rows = conn.execute("SELECT * FROM passing_checks WHERE audit_id=?", (audit_id,)).fetchall()
        return [dict(r) for r in rows]


@app.get("/api/audit/{audit_id}/schema")
def get_schema(audit_id: int):
    with get_db() as conn:
        rows = conn.execute("SELECT * FROM schema_types WHERE audit_id=?", (audit_id,)).fetchall()
        return [dict(r) for r in rows]


@app.get("/api/audit/{audit_id}/meta")
def get_meta(audit_id: int):
    with get_db() as conn:
        rows = conn.execute("SELECT * FROM meta_pages WHERE audit_id=?", (audit_id,)).fetchall()
        return [dict(r) for r in rows]


@app.get("/api/audit/{audit_id}/actions")
def get_actions(audit_id: int):
    with get_db() as conn:
        rows = conn.execute(
            "SELECT * FROM action_items WHERE audit_id=? ORDER BY phase, id",
            (audit_id,)
        ).fetchall()
        phases: dict = {}
        for r in rows:
            p = r["phase"]
            if p not in phases:
                phases[p] = {"phase": p, "label": r["phase_label"], "items": []}
            phases[p]["items"].append(dict(r))
        return list(phases.values())


@app.patch("/api/actions/{item_id}")
def toggle_action(item_id: int, body: ActionItemPatch):
    with get_db() as conn:
        conn.execute("UPDATE action_items SET completed=? WHERE id=?", (int(body.completed), item_id))
        conn.commit()
        row = conn.execute("SELECT * FROM action_items WHERE id=?", (item_id,)).fetchone()
        if not row:
            raise HTTPException(404, "Item not found")
        return dict(row)


# ── Startup ───────────────────────────────────────────────────────────────────

@app.on_event("startup")
def startup():
    init_db()


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("index:app", host="0.0.0.0", port=8000, reload=True)
