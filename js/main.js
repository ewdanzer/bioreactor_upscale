// js/main.js
document.addEventListener('DOMContentLoaded', async () => {
    const calculateBtn = document.getElementById('calculate-btn');
    const criteriaSelect = document.getElementById('criteria');
    const klaOptions = document.getElementById('kla-options');

    // Mostra/oculta opções de kLa
    criteriaSelect.addEventListener('change', () => {
        const showKla = criteriaSelect.value === 'kla';
        document.querySelectorAll('.kla-input').forEach(el => {
            el.style.display = showKla? 'block' : 'none';
        });
    });

    // Inicializa o Pyodide
    calculateBtn.textContent = 'Carregando Python...';
    calculateBtn.disabled = true;
    let pyodide;
    try {
        pyodide = await loadPyodide();
        calculateBtn.textContent = 'Calcular';
        calculateBtn.disabled = false;
    } catch (error) {
        console.error("Falha ao carregar o Pyodide:", error);
        calculateBtn.textContent = 'Erro ao carregar Python';
    }


    calculateBtn.addEventListener('click', async () => {
        try {
            // 1. Obter e validar valores da UI
            const n1_rpm = parseFloat(document.getElementById('n1').value);
            const di1 = parseFloat(document.getElementById('di1').value);
            const di2 = parseFloat(document.getElementById('di2').value);
            const selectedCriterion = criteriaSelect.value;

            if (isNaN(n1_rpm) ||
                isNaN(di1) ||
                isNaN(di2) ||
                n1_rpm <= 0 ||
                di1 <= 0 ||
                di2 <= 0) {
                alert('Por favor, preencha todos os campos de entrada principais com valores positivos.');
                return;
            }
            
            // Conversão de unidades: RPM para rps para os cálculos
            const n1_rps = n1_rpm / 60.0;

            // 2. Carregar dinamicamente o script Python correto
            const scriptName = `scale_${selectedCriterion}.py`;
            const pythonCode = await (await fetch(`./python/${scriptName}`)).text();
            pyodide.runPython(pythonCode);

            // 3. Obter a função de cálculo do Python
            const calcFunc = pyodide.globals.get('calculate_n2');
            let n2_rps;

            // 4. Chamar a função Python com os argumentos corretos
            if (selectedCriterion === 'kla') {
                const v1 = parseFloat(document.getElementById('v1').value);
                const v2 = parseFloat(document.getElementById('v2').value);
                const vvm = parseFloat(document.getElementById('aeration-rate').value);
                const fluidType = document.getElementById('fluid-type').value;

                if (isNaN(v1) ||
                    isNaN(v2) ||
                    isNaN(vvm) ||
                    v1 <= 0 ||
                    v2 <= 0 ||
                    vvm <= 0) {
                    alert('Para o critério kLa, preencha os campos de Volume e Taxa de Aeração com valores positivos.');
                    return;
                }

                // Conversão de vvm para m³/s
                // vvm (L_ar / L_meio / min) * V (L_meio) = Q (L_ar / min)
                // Q (L/min) / 60000 = Q (m³/s)
                const q1 = (vvm * v1) / 60000;
                const q2 = (vvm * v2) / 60000; // Assumindo vvm constante
                
                const exponents = fluidType === 'coalescing'? { A: 0.4, B: 0.5 } : { A: 0.7, B: 0.2 };
                
                n2_rps = calcFunc(n1_rps, di1, di2, q1, q2, exponents.A, exponents.B);
            } else {
                n2_rps = calcFunc(n1_rps, di1, di2);
            }

            // Conversão de unidades: rps para RPM para exibição
            const n2_rpm = n2_rps * 60.0;

            // 5. Exibir o resultado primário
            document.getElementById('result-n2').textContent = `${n2_rpm.toFixed(2)} RPM`;

            // 6. Calcular e exibir a análise de consequências (usando valores em RPM para consistência)
            updateConsequencesTable(n1_rpm, di1, di2, n2_rpm);

        } catch (error) {
            console.error("Erro durante o cálculo:", error);
            alert(`Ocorreu um erro: ${error.message}`);
        }
    });

    function updateConsequencesTable(n1, di1, di2, n2) {
        const tableBody = document.querySelector('#consequences-table tbody');
        tableBody.innerHTML = ''; // Limpa a tabela

        // As razões são adimensionais, então o uso de RPM ou rps é indiferente
        // desde que consistente (n1 e n2 na mesma unidade).
        const ratioN = n2 / n1;
        const ratioDi = di2 / di1;

        const consequences = {
            'P/V': (ratioN**3) * (ratioDi**2),
            'v_tip (Cisalhamento)': ratioN * ratioDi,
            'Tempo de Mistura (t_m)': (ratioDi**(1.0/6.0)) / (ratioN**(2.0/3.0)),
            'Vazão de Bombeamento (F_L/V)': ratioN,
            'Número de Reynolds (N_Re)': ratioN * (ratioDi**2)
        };

        for (const [key, value] of Object.entries(consequences)) {
            const row = tableBody.insertRow();
            row.insertCell(0).textContent = key;
            row.insertCell(1).textContent = `${value.toFixed(2)}x`;
        }
    }
    
    // Dispara o evento change para garantir que a UI de kLa esteja no estado correto no carregamento
    criteriaSelect.dispatchEvent(new Event('change'));

    // Alternância de tema claro/escuro
    (function() {
        const toggleBtn = document.getElementById('theme-toggle');
        const icon = document.getElementById('theme-icon');
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        const savedTheme = localStorage.getItem('theme-mode');
        function setTheme(dark) {
            document.body.classList.toggle('dark-mode', dark);
            icon.className = dark ? 'fas fa-sun' : 'fas fa-moon';
        }
        setTheme(savedTheme === 'dark' || (!savedTheme && prefersDark));
        toggleBtn.addEventListener('click', () => {
            const isDark = document.body.classList.toggle('dark-mode');
            icon.className = isDark ? 'fas fa-sun' : 'fas fa-moon';
            localStorage.setItem('theme-mode', isDark ? 'dark' : 'light');
        });
    })();
});