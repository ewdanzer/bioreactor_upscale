# scale_pv.py
# Calcula N2 com base na Potência por Volume (P/V) constante em regime turbulento.

def calculate_n2(n1, di1, di2):
    """
    Calcula a velocidade de rotação (N2) para a escala maior
    a fim de manter uma razão Potência/Volume constante.

    Args:
        n1 (float): Velocidade de rotação na escala menor (Escala 1) em rps.
        di1 (float): Diâmetro do impelidor na escala menor (Escala 1) em metros.
        di2 (float): Diâmetro do impelidor na escala maior (Escala 2) em metros.

    Returns:
        float: A velocidade de rotação calculada (N2) para a escala maior em rps.
    
    Raises:
        ValueError: Se os diâmetros de entrada forem zero ou negativos.
    """
    if di1 <= 0 or di2 <= 0:
        raise ValueError("Os diâmetros dos impelidores (Di₁ e Di₂) devem ser valores positivos.")
    
    # Equação: N2 = N1 * (Di1 / Di2)^(2/3)
    n2 = n1 * ((di1 / di2)**(2.0/3.0))
    return n2