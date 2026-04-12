from fastapi import APIRouter, Response, HTTPException, Path
from typing import Optional

router = APIRouter(tags=["SEO"])

@router.get("/robots.txt", response_class=Response)
async def read_robots():
    content = """User-agent: *
Allow: /
Disallow: /pillbox
Disallow: /addmed
Disallow: /login
Disallow: /register

Sitemap: http://localhost:8000/sitemap.xml"""
    
    return Response(content=content, media_type="text/plain")

@router.get("/sitemap.xml", response_class=Response)
async def read_sitemap():
    content = """<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    <url>
        <loc>http://localhost:5173/</loc>
        <lastmod>2024-01-01</lastmod>
        <changefreq>daily</changefreq>
        <priority>1.0</priority>
    </url>
</urlset>"""
    
    return Response(content=content, media_type="application/xml")

@router.get("/api/seo/structured-data/{medicine_id}")
async def get_structured_data(medicine_id: int = Path(..., gt=0)):
    return {
        "@context": "https://schema.org",
        "@type": "Drug",
        "name": f"Препарат #{medicine_id}",
        "description": "Информация о лекарственном препарате из вашей аптечки PillBox",
        "manufacturer": {
            "@type": "Organization",
            "name": "PharmaCorp"
        }
    }