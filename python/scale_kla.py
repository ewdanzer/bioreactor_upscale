# scale_kla.py
# Calcula N2 com base no coeficiente volumétrico de transferência de oxigênio (kLa) constante.

def calculate_n2(n1, di1, di2, q1, q2, A, B):
    """
    Calcula N2 para manter o kLa constante entre as escalas.
    Baseado na Eq. 15.16 de Badino & Schmidell.

    Args:
        n1 (float): Velocidade de rotação na escala menor (rps).
        di1 (float): Diâmetro do impelidor na escala menor (m).
        di2 (float): Diâmetro do impelidor na escala maior (m).
        q1 (float): Vazão de ar na escala menor (m³/s).
        q2 (float): Vazão de ar na escala maior (m³/s).
        A (float): Expoente da potência aerada (Pg/V) na correlação de kLa.
        B (float): Expoente da velocidade superficial (Vs) na correlação de kLa.

    Returns:
        float: A velocidade de rotação calculada (N2) em rps.
        
    Raises:
        ValueError: Se os parâmetros de entrada forem inválidos.
    """
    if di1 <= 0 or di2 <= 0 or q1 <= 0 or q2 <= 0:
        raise ValueError("Diâmetros e vazões devem ser valores positivos.")
    if A == 0:
        raise ValueError("O expoente A não pode ser zero, pois causa divisão por zero.")

    # Expoentes da Eq. 15.16
    exp_di = (2 * B - 2.85 * A) / (3.15 * A)
    exp_q = (0.252 * A - B) / (3.15 * A)

    # Cálculo de N2
    n2 = n1 * ((di2 / di1)**exp_di) * ((q2 / q1)**exp_q)
    
    return n2