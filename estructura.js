// Esperamos a que la página cargue
document.addEventListener('DOMContentLoaded', () => {

    /* ============================================
       0. AÑO DINÁMICO EN EL FOOTER
    ============================================ */
    const yearEl = document.getElementById('year');
    if (yearEl) yearEl.textContent = new Date().getFullYear();

    /* ============================================
       1. NOMBRE ESTÁTICO (SIN EFECTO DE ESCRITURA)
    ============================================ */
    const typewriterEl = document.querySelector('.typewriter');
    if (typewriterEl) {
        const fullText = typewriterEl.getAttribute('data-text');
        if (fullText) {
            typewriterEl.textContent = fullText;
        }
    }

    /* ============================================
       2. NAVEGACIÓN ENTRE PESTAÑAS + INDICADOR
    ============================================ */
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');
    const tabIndicator = document.getElementById('tabIndicator');

    const moveIndicator = (btn) => {
        if (!btn || !tabIndicator) return;
        const rect = btn.getBoundingClientRect();
        const parentRect = btn.parentElement.getBoundingClientRect();
        tabIndicator.style.left = (rect.left - parentRect.left) + 'px';
        tabIndicator.style.width = rect.width + 'px';
    };

    // Posicionar indicador al cargar
    const activeBtn = document.querySelector('.tab-btn.active');
    setTimeout(() => moveIndicator(activeBtn), 100);

    tabButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            tabButtons.forEach(b => b.classList.remove('active'));
            tabContents.forEach(c => c.classList.remove('active'));

            btn.classList.add('active');
            const tabId = btn.getAttribute('data-tab');
            const target = document.getElementById(tabId);
            target.classList.add('active');

            moveIndicator(btn);

            // Re-disparar animaciones reveal dentro del tab recién activado
            const reveals = target.querySelectorAll('.reveal, .reveal-sub');
            reveals.forEach((el, idx) => {
                el.classList.remove('visible');
                setTimeout(() => el.classList.add('visible'), 50 + idx * 80);
            });
        });
    });

    // Recolocar indicador al redimensionar
    window.addEventListener('resize', () => {
        moveIndicator(document.querySelector('.tab-btn.active'));
    });

    /* ============================================
       3. ACORDEÓN
    ============================================ */
    const accordionBtns = document.querySelectorAll('.accordion-btn');
    const openAllAccordionItems = () => {
        document.querySelectorAll('.accordion-item').forEach(item => {
            item.classList.add('active');
            const content = item.querySelector('.accordion-content');
            if (content) content.style.maxHeight = content.scrollHeight + 'px';
        });
    };

    openAllAccordionItems();

    accordionBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const item = btn.parentElement;
            const isActive = item.classList.contains('active');

            // Cerrar todos (comportamiento tipo acordeón)
            document.querySelectorAll('.accordion-item').forEach(it => {
                it.classList.remove('active');
                const content = it.querySelector('.accordion-content');
                content.style.maxHeight = null;
            });

            // Abrir el clickeado si estaba cerrado
            if (!isActive) {
                item.classList.add('active');
                const content = item.querySelector('.accordion-content');
                content.style.maxHeight = content.scrollHeight + 'px';
            }
        });
    });

    /* ============================================
       4. MODO OSCURO / CLARO (con onda)
    ============================================ */
    const themeToggle = document.getElementById('theme-toggle');
    const body = document.body;
    const themeIcon = themeToggle.querySelector('i');

    themeToggle.addEventListener('click', () => {
        body.classList.toggle('dark-mode');
        themeToggle.classList.add('pulse');
        setTimeout(() => themeToggle.classList.remove('pulse'), 700);

        if (body.classList.contains('dark-mode')) {
            themeIcon.classList.remove('fa-moon');
            themeIcon.classList.add('fa-sun');
        } else {
            themeIcon.classList.remove('fa-sun');
            themeIcon.classList.add('fa-moon');
        }
    });

    /* ============================================
       5. BARRA DE PROGRESO DE SCROLL
    ============================================ */
    const scrollProgress = document.getElementById('scrollProgress');
    window.addEventListener('scroll', () => {
        const scrollTop = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const percent = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
        scrollProgress.style.width = percent + '%';
    });

    /* ============================================
       6. ANIMACIONES AL HACER SCROLL (IntersectionObserver)
    ============================================ */
    const reveals = document.querySelectorAll('.reveal, .reveal-sub');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.15 });

    reveals.forEach(el => observer.observe(el));

    // Mostrar inmediatamente los del tab activo al cargar
    document.querySelectorAll('.tab-content.active .reveal, .tab-content.active .reveal-sub')
        .forEach((el, i) => setTimeout(() => el.classList.add('visible'), 200 + i * 80));

    /* ============================================
       7. PARTÍCULAS FLOTANTES (COLORES MASCULINOS)
    ============================================ */
    const particlesContainer = document.getElementById('particles');
    // Azul, Verde esmeralda, Cian, Gris acero
    const colors = ['#0284c7', '#0f766e', '#0891b2', '#334155']; 
    const totalParticles = 18;

    for (let i = 0; i < totalParticles; i++) {
        const p = document.createElement('span');
        p.classList.add('particle');
        const size = Math.random() * 8 + 4;
        p.style.width = size + 'px';
        p.style.height = size + 'px';
        p.style.left = Math.random() * 100 + '%';
        p.style.background = colors[Math.floor(Math.random() * colors.length)];
        p.style.animationDuration = (Math.random() * 12 + 10) + 's';
        p.style.animationDelay = (Math.random() * 8) + 's';
        p.style.opacity = (Math.random() * 0.4 + 0.2).toString();
        particlesContainer.appendChild(p);
    }

    /* ============================================
       8. GENERACIÓN DE PDF LIMPIO Y COMPLETO
    ============================================ */
    const printButton = document.getElementById('print-btn');
    printButton.addEventListener('click', async () => {
        const originalText = printButton.querySelector('span').textContent;
        printButton.disabled = true;
        printButton.querySelector('span').textContent = 'Generando PDF...';

        try {

            const exportNode = document.createElement('div');
            exportNode.setAttribute('aria-hidden', 'true');
            exportNode.style.position = 'fixed';
            exportNode.style.left = '-20000px';
            exportNode.style.top = '0';
            exportNode.style.width = '794px';
            exportNode.style.maxWidth = '794px';
            exportNode.style.margin = '0 auto';
            exportNode.style.background = '#ffffff';
            exportNode.style.color = '#111827';
            exportNode.style.fontFamily = 'Poppins, Arial, sans-serif';
            exportNode.style.padding = '24px 28px 20px';
            exportNode.style.boxSizing = 'border-box';
            exportNode.style.opacity = '1';
            exportNode.style.pointerEvents = 'none';
            exportNode.style.zIndex = '2147483647';
            exportNode.innerHTML = `
                <style>
                    * { box-sizing: border-box; }
                    body { margin: 0; }
                    .pdf-sheet {
                        width: 100%;
                        background: #ffffff;
                        color: #111827;
                        font-family: 'Poppins', Arial, sans-serif;
                    }
                    .pdf-header {
                        text-align: center;
                        padding-bottom: 18px;
                        border-bottom: 1px solid #d1d5db;
                        margin-bottom: 18px;
                    }
                    .pdf-photo {
                        display: block;
                        width: 120px;
                        height: 120px;
                        object-fit: cover;
                        border-radius: 50%;
                        border: 4px solid #0f766e;
                        margin: 0 auto 12px;
                        background: #f3f4f6;
                    }
                    .pdf-header h1 {
                        margin: 0;
                        font-size: 28px;
                        font-weight: 700;
                        color: #111827;
                    }
                    .pdf-header p {
                        margin: 8px 0 0;
                        font-size: 14px;
                        color: #475569;
                    }
                    .pdf-section {
                        margin-bottom: 18px;
                    }
                    .pdf-section h2 {
                        margin: 0 0 10px;
                        font-size: 18px;
                        color: #111827;
                    }
                    .pdf-text,
                    .pdf-item p,
                    .pdf-contact span,
                    .pdf-skill {
                        font-size: 12px;
                        line-height: 1.5;
                        color: #374151;
                    }
                    .pdf-preview-grid {
                        display: grid;
                        grid-template-columns: 1fr 1fr;
                        gap: 12px;
                        margin-top: 10px;
                    }
                    .pdf-preview-box {
                        border: 1px solid #d1d5db;
                        border-radius: 12px;
                        padding: 10px;
                        background: #ffffff;
                    }
                    .pdf-preview-box img {
                        display: block;
                        width: 100%;
                        height: auto;
                        border: 1px solid #e5e7eb;
                        border-radius: 8px;
                        background: #f8fafc;
                    }
                    .pdf-preview-box strong {
                        display: block;
                        margin-bottom: 8px;
                        font-size: 12px;
                        color: #111827;
                    }
                    .pdf-item {
                        border: 1px solid #d1d5db;
                        border-radius: 12px;
                        padding: 10px 12px;
                        margin-bottom: 10px;
                        background: #ffffff;
                    }
                    .pdf-item strong {
                        display: block;
                        margin-bottom: 4px;
                        font-size: 13px;
                        color: #111827;
                    }
                    .pdf-actions {
                        margin-top: 10px;
                        display: flex;
                        flex-wrap: wrap;
                        gap: 8px;
                    }
                    .pdf-link {
                        display: inline-flex;
                        align-items: center;
                        gap: 6px;
                        text-decoration: none;
                        color: #ffffff;
                        background: linear-gradient(135deg, #dc2626, #ef4444);
                        border: 1px solid #dc2626;
                        border-radius: 999px;
                        padding: 7px 12px;
                        font-size: 11px;
                        font-weight: 700;
                        box-shadow: 0 3px 10px rgba(220, 38, 38, 0.18);
                    }
                    .pdf-skills {
                        display: grid;
                        grid-template-columns: 1fr 1fr;
                        gap: 10px;
                    }
                    .pdf-skill {
                        border: 1px solid #d1d5db;
                        border-radius: 10px;
                        padding: 8px 10px;
                        background: #ffffff;
                        text-align: center;
                    }
                    .pdf-contact {
                        display: flex;
                        align-items: center;
                        gap: 10px;
                        border: 1px solid #d1d5db;
                        border-radius: 10px;
                        padding: 9px 10px;
                        margin-bottom: 9px;
                    }
                    .pdf-contact img {
                        width: 22px;
                        height: 22px;
                        border-radius: 6px;
                        object-fit: cover;
                        background: #e5e7eb;
                    }
                    .pdf-contact strong {
                        display: block;
                        font-size: 12px;
                        color: #111827;
                    }
                    .pdf-contact small {
                        display: block;
                        font-size: 10px;
                        color: #64748b;
                    }
                </style>
                <div class="pdf-sheet">
                    <div class="pdf-header">
                        <img class="pdf-photo" src="archivos/Recursos%20fotoportada.jpeg" alt="Foto de perfil">
                        <h1>Jesus Rodriguez Caro</h1>
                        <p>Ingeniero de Software en formación</p>
                    </div>

                    <div class="pdf-section">
                        <h2>Sobre mí</h2>
                        <p class="pdf-text">Soy estudiante de cuarto semestre de Ingeniería de Software y me apasiona aprender cosas nuevas, especialmente en el área el desarrollo de software. Actualmente trabajo en una IPS en el área administrativa de servicios de salud, donde he adquirido experiencia en organización, atención y manejo de información. Me considero una persona responsable, con ganas de seguir aprendiendo y mejorar mis habilidades tanto profesionales como personales. Busco seguir creciendo y aplicar mis conocimientos en pequeños proyectos prácticos que me permitan mejorar cada día más. Mi principal objetivo es crear soluciones a los pequeños problemas que se presenta en la sociedad.</p>
                    </div>

                    <div class="pdf-section">
                        <h2>Formación</h2>
                        <div class="pdf-item">
                            <strong>Bachiller académico</strong>
                            <p>Institución Educativa Pio XII.</p>
                            <div class="pdf-actions">
                                <a class="pdf-link" href="archivos/Recursos%20diploma%20de%20bachiller.pdf">Ver diploma académico</a>
                            </div>
                        </div>
                        <div class="pdf-item">
                            <strong>Técnico en Nómina y Prestaciones Sociales</strong>
                            <p>Graduado en 2022, con 4 años de experiencia en el área administrativa de una IPS como digitador.</p>
                            <div class="pdf-actions">
                                <a class="pdf-link" href="archivos/Recursos%20Tecnico%20en%20nomina%20y%20prestaciones%20sociales.pdf">Ver certificado</a>
                            </div>
                        </div>
                    </div>

                    <div class="pdf-section">
                        <h2>Habilidades</h2>
                        <div class="pdf-skills">
                            <div class="pdf-skill">Área administrativa de servicios de la salud</div>
                            <div class="pdf-skill">Desarrollo de campañas de promoción en redes sociales</div>
                            <div class="pdf-skill">Manejo de Excel</div>
                            <div class="pdf-skill">En proceso de aprendizaje: HTML y Python</div>
                        </div>
                    </div>

                    <div class="pdf-section">
                        <h2>Contacto</h2>
                        <div class="pdf-contact">
                            <img src="archivos/Recursos%20logo%20de%20telefono.jpeg" alt="Teléfono">
                            <div>
                                <small>Teléfono</small>
                                <strong>3148788346</strong>
                            </div>
                        </div>
                        <div class="pdf-contact">
                            <img src="archivos/Recursos%20logo%20de%20correo.jpeg" alt="Correo">
                            <div>
                                <small>Correo electrónico</small>
                                <strong>jesuroca067@gmail.com</strong>
                            </div>
                        </div>
                    </div>
                </div>
            `;

            document.body.appendChild(exportNode);
            await new Promise(resolve => requestAnimationFrame(() => setTimeout(resolve, 120)));

            const canvas = await html2canvas(exportNode, {
                scale: 2,
                useCORS: true,
                allowTaint: true,
                backgroundColor: '#ffffff',
                logging: false,
                width: 794,
                height: exportNode.scrollHeight + 40,
                windowWidth: 794,
                scrollX: 0,
                scrollY: 0
            });

            const { jsPDF } = window.jspdf;
            const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
            const pageWidth = pdf.internal.pageSize.getWidth();
            const pageHeight = pdf.internal.pageSize.getHeight();
            const margin = 10;
            const imgData = canvas.toDataURL('image/png');
            const naturalWidth = canvas.width;
            const naturalHeight = canvas.height;
            const renderedWidth = pageWidth - margin * 2;
            const renderedHeight = (naturalHeight * renderedWidth) / naturalWidth;
            const scale = Math.min(1, (pageHeight - margin * 2) / renderedHeight);
            const finalWidth = renderedWidth * scale;
            const finalHeight = renderedHeight * scale;

            pdf.addImage(imgData, 'PNG', margin, 8, finalWidth, finalHeight, undefined, 'FAST');

            const exportBounds = exportNode.getBoundingClientRect();
            const exportWidth = exportNode.offsetWidth;
            const exportHeight = exportNode.scrollHeight;
            exportNode.querySelectorAll('.pdf-link').forEach(link => {
                const linkBounds = link.getBoundingClientRect();
                const linkX = margin + ((linkBounds.left - exportBounds.left) / exportWidth) * finalWidth;
                const linkY = 8 + ((linkBounds.top - exportBounds.top) / exportHeight) * finalHeight;
                const linkWidth = (linkBounds.width / exportWidth) * finalWidth;
                const linkHeight = (linkBounds.height / exportHeight) * finalHeight;
                const linkUrl = new URL(link.getAttribute('href'), window.location.href).href;
                pdf.link(linkX, linkY, linkWidth, linkHeight, { url: linkUrl });
            });

            const pdfBlob = pdf.output('blob');
            const pdfUrl = URL.createObjectURL(pdfBlob);
            const downloadLink = document.createElement('a');
            downloadLink.href = pdfUrl;
            downloadLink.download = 'hoja-de-vida-jesus-rodriguez.pdf';
            downloadLink.style.display = 'none';
            document.body.appendChild(downloadLink);
            downloadLink.click();
            downloadLink.remove();

            setTimeout(() => URL.revokeObjectURL(pdfUrl), 1000);
        } catch (error) {
            console.error('No se pudo generar el PDF:', error);
            alert('No se pudo generar el PDF. Inténtalo de nuevo.');
        } finally {
            printButton.disabled = false;
            printButton.querySelector('span').textContent = originalText;
            const exportRoot = document.querySelector('[aria-hidden="true"]');
            if (exportRoot) exportRoot.remove();
        }
    });

});