import os
from jose import JWTError, jwt
from datetime import datetime, timedelta

SECRET_KEY = os.getenv("SECRET_KEY", "dev_secret")  # fallback local
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", 10080))


def create_access_token(data: dict):
    to_encode = data.copy()

    expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire}) 

    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

    return encoded_jwt


def verify_token(token: str):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        return payload
    except JWTError:
        return None 
    
#Reset token functions (Alterar senha) 
def create_reset_token(user_id):
    payload = {
        "user_id": user_id,
        "type": "password_resert",
        "exp": datetime.utcnow() + timedelta(minutes=15)
    }

    return jwt.encode(payload, SECRET_KEY, algorithm=ALGORITHM)

def verify_reset_token(token):
    try:
       payload = jwt.decode(
           token,
           SECRET_KEY,
           algorithms=[ALGORITHM]
       )

       if payload.get("type") != "password_resert":
           return None 
       
       return payload.get("user_id")
    
    except JWTError:
        return None
