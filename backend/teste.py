from passlib.context import CryptContext

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

senha = "admin123"

print(pwd_context.hash(senha))