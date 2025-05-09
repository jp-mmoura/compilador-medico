"""
Compilador Médico Core Package
"""

from .parser import parser
from .semantic import validar_registro

__all__ = ['parser', 'validar_registro'] 