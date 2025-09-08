# scale_flow.py
# Calcula N2 com base na capacidade de bombeamento por volume (F_L/V) constante.

def calculate_n2(n1, di1, di2):
    """
    Calcula N2 para manter a capacidade de bombeamento por volume constante.
    Neste critério, N2 é igual a N1.

    Args:
        n1 (float): Velocidade de rotação na escala menor (rps).
        di1 (float): Diâmetro do impelidor na escala menor (m) - não utilizado.
        di2 (float): Diâmetro do impelidor na escala maior (m) - não utilizado.

    Returns:
        float: A velocidade de rotação calculada (N2) em rps.
    """
    # Para F_L/V constante, a rotação é mantida. N2 = N1.
    return n1