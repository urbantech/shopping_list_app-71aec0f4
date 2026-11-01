"""
shopping_list_app — Backend API
Built on AINative Platform. Uses ZeroDB for storage, AINative JWT for auth.
"""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import uvicorn

from app.routers.authentication import router as authentication_router
from app.routers.item_creation import router as item_creation_router
from app.routers.item_check_off import router as item_check_off_router
from app.routers.item_deletion import router as item_deletion_router
from app.routers.list_items import router as list_items_router

app = FastAPI(
    title="shopping_list_app API",
    version="0.1.0",
    description="Backend API for shopping_list_app, powered by AINative platform"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "https://*.ainative.studio"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(authentication_router, prefix='/api/v1')
app.include_router(item_creation_router, prefix='/api/v1')
app.include_router(item_check_off_router, prefix='/api/v1')
app.include_router(item_deletion_router, prefix='/api/v1')
app.include_router(list_items_router, prefix='/api/v1')

@app.get("/health")
async def health():
    return {"status": "healthy", "service": "shopping_list_app"}

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
