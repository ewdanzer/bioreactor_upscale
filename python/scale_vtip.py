# scale_vtip.py
# Calcula N2 com base na velocidade constante na extremidade do impelidor (v_tip).

def calculate_n2(n1, di1, di2):
    """
    Calcula N2 para manter a velocidade na ponta do impelidor constante.

    Args:
        n1 (float): Velocidade de rotação na escala menor (rps).
        di1 (float): Diâmetro do impelidor na escala menor (m).
        di2 (float): Diâmetro do impelidor na escala maior (m).

    Returns:
        float: A velocidade de rotação calculada (N2) em rps.

    Raises:
        ValueError: Se os diâmetros de entrada forem zero ou negativos.
    """
    if di1 <= 0 or di2 <= 0:
        raise ValueError("Os diâmetros dos impelidores (Di₁ e Di₂) devem ser valores positivos.")
    
    # Equação: N2 = N1 * (Di1 / Di2)
    n2 = n1 * (di1 / di2)
    return n2