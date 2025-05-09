from setuptools import setup, find_packages

setup(
    name="compilador-medico",
    version="0.1.0",
    packages=find_packages(),
    install_requires=[
        "fastapi",
        "uvicorn",
        "pydantic",
        "ply"
    ],
    python_requires=">=3.8",
) 