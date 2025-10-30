from fastapi import APIRouter

router = APIRouter()

#post

@router.post("/medicine/name")
async def post_name():
    return

@router.post("/medicine/bbdate")
async def post_bbdate():
    return

@router.post("/medicine/purpose")
async def post_purpose():
    return

@router.post("/medicine/form")
async def post_form():
    return

#get

@router.get("/medicine/name")
async def get_name():
    return

@router.get("/medicine/bbdate")
async def get_bbdate():
    return

@router.get("/medicine/purpose")
async def get_purpose():
    return

@router.get("/medicine/form")
async def get_form():
    return
