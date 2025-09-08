# Calculadora de Escalonamento de Biorreatores

Este projeto é uma calculadora web interativa para escalonamento de biorreatores, permitindo comparar diferentes critérios de escala e visualizar as consequências de cada escolha. O cálculo é feito em Python, executado no navegador via Pyodide.

## O que é Escalonamento de Biorreatores?
O escalonamento de biorreatores é o processo de transferir processos biotecnológicos de pequena escala (laboratório/piloto) para grande escala (industrial), mantendo desempenho e produtividade. Isso exige ajustar variáveis como rotação, diâmetro do impelidor, volume e taxa de aeração, de modo a preservar parâmetros críticos do processo.

## Critérios de Escalonamento e Equações
A calculadora permite escolher entre os principais critérios de escalonamento:

### 1. Potência por Volume (P/V) Constante
Mantém a razão de potência dissipada por volume igual entre as escalas.

**Equação:**

    N₂ = N₁ × (Di₁ / Di₂)^(2/3)

### 2. Velocidade de Ponta (v_tip) Constante
Mantém a velocidade na extremidade do impelidor igual entre as escalas.

**Equação:**

    N₂ = N₁ × (Di₁ / Di₂)

### 3. Tempo de Mistura (t_m) Constante
Mantém o tempo de mistura igual entre as escalas.

**Equação:**

    N₂ = N₁ × (Di₂ / Di₁)^(1/4)

### 4. Vazão de Bombeamento por Volume (F_L/V) Constante
Mantém a capacidade de bombeamento por volume igual entre as escalas.

**Equação:**

    N₂ = N₁

### 5. Número de Reynolds (N_Re) Constante
Mantém o regime de escoamento igual entre as escalas.

**Equação:**

    N₂ = N₁ × (Di₁ / Di₂)^2

### 6. Coeficiente de Transferência de O₂ (kLa) Constante
Mantém o kLa igual entre as escalas, usando correlações empíricas.

**Equação (baseada em Badino & Schmidell):**

    N₂ = N₁ × (Di₂ / Di₁)^exp_di × (Q₂ / Q₁)^exp_q

Onde:
- exp_di = (2B - 2,85A) / (3,15A)
- exp_q = (0,252A - B) / (3,15A)
- A e B dependem do tipo de fluido (coalescente ou não)
- Q = vazão de ar (m³/s)

## Implementação em Python
Cada critério possui um script Python dedicado, com uma função `calculate_n2` que recebe os parâmetros relevantes e retorna a rotação calculada para a escala 2. Os scripts estão na pasta `python/`:

- `scale_pv.py`: Potência/Volume
- `scale_vtip.py`: Velocidade de Ponta
- `scale_tm.py`: Tempo de Mistura
- `scale_flow.py`: Vazão de Bombeamento
- `scale_reynolds.py`: Número de Reynolds
- `scale_kla.py`: kLa

Scripts implementados via Pyodide. Em caso de bugs/erros, por favor contatar-me.

## Como usar
1. Preencha os parâmetros da escala 1 e 2.
2. Escolha o critério de escalonamento.
3. Clique em "Calcular".
4. Veja a rotação sugerida e a análise de consequências.

---
Desenvolvido por Emerson Willian Danzer