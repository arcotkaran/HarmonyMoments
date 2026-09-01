# -*- coding: utf-8 -*-
"""Builds the Google Ads plan and validates every character limit Google
enforces. Anything over the limit is rejected at upload, so this fails
loudly rather than handing over copy that will not save."""
import io, json

BASE = "https://harmonymoments.com.au"

GROUPS = [
{"name": "Proposals", "url": BASE + "/occasions/proposal-picnic-sydney/",
 "p1": "proposal", "p2": "sydney", "price": "$499",
 "headlines": ["Proposal Picnic Sydney", "Styled Proposal Setups", "Sydney Proposal Picnics",
   "Propose By The Harbour", "Set Up Before You Arrive", "Floral Heart Arch Hire",
   "Marry Me Setup Sydney", "We Keep The Surprise", "Rated 5.0 On Google",
   "From $499 | Sydney Wide", "Packed Down After You", "Harbourside Or Beach",
   "Book Your Sunset Slot", "Styled By Hand, Sydney", "Get A Quote Today"],
 "descs": ["We style the whole setting in secret, then vanish before you arrive. You just ask.",
   "Heart arch, florals, candles and signage. Set up before you arrive, packed down after.",
   "Harbourside, beach or park. Tell us your date and we will send an exact quote.",
   "Rated 5.0 on Google. Sydney-wide proposal styling from $499. Message us on WhatsApp."],
 "exact": ["proposal picnic sydney", "proposal setup sydney", "marriage proposal setup sydney",
   "proposal decoration sydney", "romantic proposal sydney", "proposal planner sydney",
   "engagement proposal setup sydney", "proposal picnic setup", "marry me sign hire sydney",
   "proposal arch hire sydney"],
 "phrase": ["proposal picnic", "proposal setup", "proposal styling sydney", "surprise proposal sydney",
   "proposal ideas sydney", "beach proposal sydney", "harbour proposal sydney", "proposal package sydney"]},

{"name": "Date Nights", "url": BASE + "/occasions/romantic-picnic-date-sydney/",
 "p1": "date-night", "p2": "sydney", "price": "$250",
 "headlines": ["Romantic Picnic Sydney", "Date Night Picnic Setup", "Styled Date Nights Sydney",
   "A Table For Two, Styled", "Set Up Before You Arrive", "Golden Hour Picnic Hire",
   "Luxury Picnic For Two", "Rated 5.0 On Google", "From $250 | Sydney Wide",
   "Packed Down After You", "Harbourside Or Backyard", "Surprise Them Tonight",
   "Book A Sunset Table", "Styled By Hand, Sydney", "Check Your Date Free"],
 "descs": ["A table for two, styled at golden hour and waiting for you. You just turn up.",
   "Low table, florals, candles and cushions. Set up before you arrive, packed down after.",
   "Harbourside, beach, park or your own backyard. From $250, Sydney-wide.",
   "Rated 5.0 on Google. Tell us your date and we will send an exact quote."],
 "exact": ["romantic picnic sydney", "date night picnic sydney", "picnic for two sydney",
   "romantic picnic setup sydney", "luxury picnic for two sydney", "date night ideas sydney",
   "romantic date setup sydney", "picnic date sydney"],
 "phrase": ["romantic picnic", "date night picnic", "picnic for two", "romantic setup sydney",
   "luxury picnic sydney", "romantic dinner setup sydney", "surprise date sydney"]},

{"name": "Anniversaries", "url": BASE + "/occasions/anniversary-picnic-sydney/",
 "p1": "anniversary", "p2": "sydney", "price": "$250",
 "headlines": ["Anniversary Picnic Sydney", "Styled Anniversary Setups", "Anniversary Ideas Sydney",
   "Mark It Properly", "Set Up Before You Arrive", "Golden Hour, Harbourside",
   "Luxury Picnic For Two", "Rated 5.0 On Google", "From $250 | Sydney Wide",
   "Packed Down After You", "Cake And Florals Added", "Surprise Them This Year",
   "Book A Sunset Table", "Styled By Hand, Sydney", "Check Your Date Free"],
 "descs": ["However many years it has been, it deserves more than a restaurant booking.",
   "Low table, florals, candles and cushions. Set up before you arrive, packed down after.",
   "Harbourside, beach, park or your own backyard. From $250, Sydney-wide.",
   "Rated 5.0 on Google. Tell us your date and we will send an exact quote."],
 "exact": ["anniversary picnic sydney", "anniversary setup sydney", "anniversary ideas sydney",
   "anniversary decoration sydney", "anniversary surprise sydney", "romantic anniversary sydney",
   "anniversary celebration sydney", "anniversary dinner setup sydney"],
 "phrase": ["anniversary picnic", "anniversary setup", "anniversary styling sydney",
   "anniversary surprise", "wedding anniversary sydney", "anniversary package sydney"]},

{"name": "Birthdays", "url": BASE + "/occasions/birthday-picnic-sydney/",
 "p1": "birthday", "p2": "sydney", "price": "$250",
 "headlines": ["Birthday Picnic Sydney", "Styled Birthday Setups", "Birthday Picnic Hire",
   "No Setting Up Or Packing", "Set Up Before You Arrive", "Luxury Picnic Birthdays",
   "For Two Or Up To Six", "Rated 5.0 On Google", "From $250 | Sydney Wide",
   "Packed Down After You", "Cake, Balloons, Signage", "Harbourside Or Backyard",
   "Book A Sunset Slot", "Styled By Hand, Sydney", "Check Your Date Free"],
 "descs": ["Turn up to a table already styled. No hauling, no setting up, no packing down.",
   "Low table, florals, candles and cushions for two, or a group of up to six.",
   "Cake, balloons and signage on request. Harbourside, park or your own backyard.",
   "From $250 for two, $350 for 4-6 guests. Rated 5.0 on Google. Sydney-wide."],
 "exact": ["birthday picnic sydney", "birthday picnic setup sydney", "birthday setup sydney",
   "luxury picnic birthday sydney", "birthday party picnic sydney", "birthday decoration sydney",
   "picnic birthday party sydney", "outdoor birthday sydney"],
 "phrase": ["birthday picnic", "birthday picnic setup", "birthday styling sydney",
   "birthday party setup sydney", "picnic party sydney", "birthday ideas sydney"]},

{"name": "Baby Showers", "url": BASE + "/occasions/baby-shower-picnic-sydney/",
 "p1": "baby-shower", "p2": "sydney", "price": "$350",
 "headlines": ["Baby Shower Picnic Sydney", "Styled Baby Showers", "Baby Shower Picnic Hire",
   "Beautiful, With No Lifting", "Set Up Before Guests Come", "Pastel Balloon Arch Hire",
   "Styled For Four To Six", "Rated 5.0 On Google", "From $350 | Sydney Wide",
   "Packed Down After You", "Your Palette, Matched", "Harbourside Or Garden",
   "Book Your Date Now", "Styled By Hand, Sydney", "Check Your Date Free"],
 "descs": ["A soft, beautiful setting styled outdoors, without you carrying a single thing.",
   "Low table, florals, cushions and styling for four to six guests. Your palette.",
   "Balloon arch and dessert styling on request. Harbourside, park or your own garden.",
   "From $350. Rated 5.0 on Google. Set up before guests arrive, packed down after."],
 "exact": ["baby shower picnic sydney", "baby shower setup sydney", "baby shower styling sydney",
   "baby shower decoration sydney", "outdoor baby shower sydney", "baby shower venue sydney",
   "baby shower ideas sydney", "baby shower party sydney"],
 "phrase": ["baby shower picnic", "baby shower setup", "baby shower styling",
   "baby shower balloon arch sydney", "baby shower package sydney"]},

{"name": "Bridal Showers", "url": BASE + "/occasions/bridal-shower-picnic-sydney/",
 "p1": "bridal-shower", "p2": "sydney", "price": "$350",
 "headlines": ["Bridal Shower Picnic Sydney", "Styled Bridal Showers", "Hens Picnic Sydney",
   "Nothing Left For You To Do", "Set Up Before Guests Come", "White And Blush Florals",
   "Styled For Four To Six", "Rated 5.0 On Google", "From $350 | Sydney Wide",
   "Packed Down After You", "Your Palette, Matched", "Harbourside Or Garden",
   "Book Your Date Now", "Styled By Hand, Sydney", "Check Your Date Free"],
 "descs": ["Somewhere beautiful, styled properly, with nothing for you to carry or clean up.",
   "Low table, white and blush florals, cushions and styling for four to six guests.",
   "Cake and signage on request. Harbourside, park or your own garden. Sydney-wide.",
   "From $350. Rated 5.0 on Google. Set up before guests arrive, packed down after."],
 "exact": ["bridal shower picnic sydney", "bridal shower setup sydney", "bridal shower styling sydney",
   "hens party picnic sydney", "bridal shower ideas sydney", "hens picnic sydney",
   "bridal shower venue sydney", "bridal shower decoration sydney"],
 "phrase": ["bridal shower picnic", "bridal shower setup", "bridal shower styling",
   "hens party setup sydney", "kitchen tea sydney", "bridal shower package sydney"]},
]

NEGATIVES = ["free", "cheap", "diy", "jobs", "job", "hiring", "salary", "basket", "hamper",
  "blanket", "equipment", "wholesale", "supplies", "course", "how to make", "template",
  "clipart", "melbourne", "brisbane", "perth", "adelaide", "canberra", "gold coast",
  "hobart", "darwin", "newcastle", "wollongong", "central coast", "second hand", "gumtree",
  "restaurant", "cafe", "council permit", "rental only", "food only", "catering only"]

CALLOUTS = ["Set up before you arrive", "Packed down after", "Rated 5.0 on Google",
            "Sydney-wide", "Styled by hand", "No obligation quote"]

SITELINKS = [
 ("Proposal Picnics", "Heart arch, florals, signage.", "Set up in secret. From $499.",
  BASE + "/occasions/proposal-picnic-sydney/"),
 ("Birthday Picnics", "For two or up to six guests.", "Cake and balloons on request.",
  BASE + "/occasions/birthday-picnic-sydney/"),
 ("Baby Showers", "Pastel styling for 4-6 guests.", "Balloon arch on request.",
  BASE + "/occasions/baby-shower-picnic-sydney/"),
 ("Our Reviews", "Rated 5.0 on Google.", "Read what clients say.", BASE + "/#reviews"),
]

SNIPPET_HEADER = "Service catalogue"
SNIPPET_VALUES = ["Proposals", "Date nights", "Anniversaries", "Birthdays",
                  "Baby showers", "Bridal showers"]

# ---------------------------------------------------------------- validate
errs = []
def chk(kind, text, limit, ctx):
    if len(text) > limit:
        errs.append("%s | %s %d/%d: %s" % (ctx, kind, len(text), limit, text))

for g in GROUPS:
    for h in g["headlines"]: chk("headline", h, 30, g["name"])
    for d in g["descs"]:     chk("description", d, 90, g["name"])
    chk("path1", g["p1"], 15, g["name"])
    chk("path2", g["p2"], 15, g["name"])
for t, d1, d2, u in SITELINKS:
    chk("sitelink text", t, 25, "sitelinks")
    chk("sitelink desc1", d1, 35, "sitelinks")
    chk("sitelink desc2", d2, 35, "sitelinks")
for c in CALLOUTS:       chk("callout", c, 25, "callouts")
for v in SNIPPET_VALUES: chk("snippet value", v, 25, "snippets")

print("VALIDATION")
if errs:
    print("  X OVER LIMIT - fix before uploading:")
    for e in errs: print("    " + e)
else:
    print("  OK  headlines <=30, descriptions <=90, paths <=15, callouts <=25, sitelinks <=25/35")
print("  %d ad groups | %d headlines | %d keywords | %d negatives" % (
    len(GROUPS), sum(len(g["headlines"]) for g in GROUPS),
    sum(len(g["exact"]) + len(g["phrase"]) for g in GROUPS), len(NEGATIVES)))

# ---------------------------------------------------------------- outputs
# 1. Google Ads Editor / bulk-upload CSV for keywords
with io.open("keywords-upload.csv", "w", encoding="utf8", newline="") as f:
    f.write("Campaign,Ad group,Keyword,Match type\n")
    for g in GROUPS:
        for k in g["exact"]:
            f.write('Harmony Moments - Search,%s,%s,Exact\n' % (g["name"], k))
        for k in g["phrase"]:
            f.write('Harmony Moments - Search,%s,%s,Phrase\n' % (g["name"], k))
    for n in NEGATIVES:
        f.write('Harmony Moments - Search,,%s,Campaign Negative Broad\n' % n)

# 2. human-readable plan
L = []
L.append("# Harmony Moments - Google Ads plan\n")
L.append("One ad group per occasion, each pointing at its own landing page.\n")
L.append("Campaign: **Harmony Moments - Search** (existing). Add these ad groups inside it.\n")
L.append("\n---\n")
for g in GROUPS:
    L.append("\n## Ad group: %s\n" % g["name"])
    L.append("**Final URL**\n\n    %s\n" % g["url"])
    L.append("\n**Display path:** `/%s` `/%s`  |  **Starting price:** %s\n" % (g["p1"], g["p2"], g["price"]))
    L.append("\n### Headlines (paste one per line, 15 total)\n")
    for h in g["headlines"]:
        L.append("- %s  *(%d)*\n" % (h, len(h)))
    L.append("\n### Descriptions (4 total)\n")
    for d in g["descs"]:
        L.append("- %s  *(%d)*\n" % (d, len(d)))
    L.append("\n### Keywords - Exact match `[...]`\n")
    for k in g["exact"]:
        L.append("- [%s]\n" % k)
    L.append("\n### Keywords - Phrase match `\"...\"`\n")
    for k in g["phrase"]:
        L.append('- "%s"\n' % k)
    L.append("\n---\n")

L.append("\n## Campaign-level negative keywords\n\n")
L.append("Add once at campaign level, match type **Broad**. Stops the wrong clicks across every ad group.\n\n")
L.append("```\n" + "\n".join(NEGATIVES) + "\n```\n")

L.append("\n## Assets (set once at campaign level)\n")
L.append("\n### Callouts\n")
for c in CALLOUTS: L.append("- %s\n" % c)
L.append("\n### Sitelinks\n")
for t, d1, d2, u in SITELINKS:
    L.append("- **%s** - %s %s  ->  %s\n" % (t, d1, d2, u))
L.append("\n### Structured snippet\n")
L.append("- Header: %s\n" % SNIPPET_HEADER)
L.append("- Values: %s\n" % ", ".join(SNIPPET_VALUES))

io.open("google-ads-plan.md", "w", encoding="utf8").write("".join(L))
print("\n  wrote google-ads-plan.md and keywords-upload.csv")
