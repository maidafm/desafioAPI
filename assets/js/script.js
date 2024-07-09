document.getElementById('formulario').addEventListener('submit', async function (e) {
    e.preventDefault();
    
    const cantidad = document.getElementById('clp').value;
    const moneda = document.getElementById('selector').value;
    const resultado = document.getElementById('resultado');
    const errorCont = document.getElementById('error');
    const grafico = document.getElementById('grafico');
    
    resultado.innerHTML = '';
    errorCont.innerHTML = '';
    grafico.style.display = 'none';

    try {
        const response = await fetch(`https://mindicador.cl/api/${moneda}`);
        if (!response.ok) {
            throw new Error('Error al obtener los datos de la API');
        }
        
        const data = await response.json();
        const ratio = data.serie[0].valor;
        const convertirCantidad = (cantidad / ratio).toFixed(2);

        resultado.innerHTML = `${cantidad} CLP = ${convertirCantidad} ${moneda.toUpperCase()}`;

        const ultimosDiez = data.serie.slice(0, 10).reverse();
        const etiquetas = ultimosDiez.map(day => day.fecha.substring(0, 10));
        const valores = ultimosDiez.map(day => day.valor);

        grafico.style.display = 'block';
        new Chart(grafico, {
            type: 'line',
            data: {
                etiquetas: etiquetas,
                datasets: [{
                    label: `Historial últimos 10 días de ${moneda.toUpperCase()}`,
                    data: valores,
                    borderColor: 'rgba(0, 207, 255, 1)',
                    backgroundColor: 'rgba(0, 207, 255, 0.2)',
                    borderWidth: 1
                }]
            }
        });
    } catch (error) {
        errorCont.innerHTML = `Error: ${error.message}`;
    }
});
