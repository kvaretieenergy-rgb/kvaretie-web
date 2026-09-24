# Continuidad de KVARETIE — tandas 01 a 05

Actualizado: 23 de septiembre de 2026.

## Estado de cierre

- Repositorio `kvaretieenergy-rgb/kvaretie-web`, rama `main`; base anterior `a84beaa4e79ee1755e98d67a5282985e995e9cde`.
- El usuario autorizó expresamente completar, verificar, hacer commit y publicar a `main`. Esa autorización sustituye la espera de nuevas tandas indicada en las etapas anteriores.
- **64 fotografías en las dos galerías: 28 en Nuestro trabajo y 36 exclusivamente en Trabajos de los Aliados.** Las cinco tandas suman 45 fotos nuevas, incluida la última tanda de cinco; 90 archivos WebP (ampliación y miniatura).
- La página principal contiene 86 fotografías únicas contando portada, otras secciones y las 18 fotografías de procesos. No se cuentan logos ni miniaturas como fotografías adicionales.
- `index.html#trabajos-aliados` tiene sus filtros independientes por especialidad. El visor limita anterior/siguiente a la galería y filtro desde donde se abrió; no cruza fotos generales con Aliados.
- Especialidades de Aliados: canalización y obra civil (5), cámaras y registros (5), tableros y medición (9), cableado y conectividad (2), transformadores y redes (11), trabajos en poste (2), materiales y suministros (2).
- No se inventaron nombres de proyectos, clientes ni ubicaciones. `project: null` indica una obra sin identidad confirmada; la clasificación por especialidad no declara que sean una misma obra. Se preservaron todas las tomas desde otros ángulos.
- Se retiró una tarjeta exactamente duplicada de la galería: `solar-rooftop-multimetro-full.jpg` tiene los mismos píxeles que `tecnicos-paneles-solares-tablero-full.jpg`, conservada en portada. No se borró ningún archivo original ni activo antiguo.
- Brochure separado en `brochure/`, con botón «Ver brochure» en apartado propio, menú móvil y pie. En escritorio utiliza hasta 1120 px; móvil mantiene su diseño. Su HTML, fotografías, textos, enlaces y JavaScript aprobado permanecen iguales fuera de los estilos.
- No hay fotografías recibidas pendientes de integrar. El código de formulario HubSpot sigue pendiente: no se encontró `hbspt.forms.create`, `formId`, `hs-form-frame` ni un embed `js.hsforms.net` en el repositorio. El portal del chat no equivale a un formulario. Se conserva FormSubmit y no se modifica CRM, bots ni HubSpot.
- URL pública: https://kvaretieenergy-rgb.github.io/kvaretie-web/ . El commit que contiene esta sección identifica el cierre de fotos (`git log -1 -- docs/CONTINUIDAD-FOTOS.md`). El resultado del despliegue se confirma en GitHub Actions y en la página pública tras el push.

## Archivos del cierre

- `index.html`, `assets/css/styles.css`, `assets/js/main.js`, `brochure/index.html`: se conservaron y completaron los cuatro archivos que ya tenían cambios locales.
- `assets/img/`: 90 WebP registrados en los cinco manifiestos. Ampliaciones 1254 × 1254 sin pérdida, miniaturas 640 × 640 con carga diferida; logos, fechas y marcas de agua completos.
- `docs/fotos-tanda-01.json` a `05.json`: originales, hashes, tamaños y ubicación actual de cada foto; `docs/CONTINUIDAD-FOTOS.md`: continuidad.
- `scripts/gallery.test.cjs`: prueba de independencia de filtros y navegación del visor.
- `images/brochure-campo-transformador.png` es un archivo local preexistente ajeno a esta entrega: se conserva sin modificar y se excluye del commit. No añadirlo o borrarlo por accidente.

## Comprobaciones del cierre

- 45 originales comprobados por SHA-256 y equivalencia píxel por píxel con sus ampliaciones; 90 derivados conservan los hashes de los manifiestos. Cada foto tiene una sola tarjeta.
- Auditoría de las 86 fotografías de la página principal mediante hashes de píxeles y comparación perceptual: sin candidatos duplicados después de retirar la tarjeta repetida. Las miniaturas y las ampliaciones son derivados de una única foto, no tarjetas duplicadas.
- 561 referencias internas y anclas en siete páginas, sin destinos inexistentes; imágenes de la página principal servidas por HTTP y cotejadas contra los archivos locales.
- Página principal y Brochure a 360, 390, 768, 1366 y 1920 px: sin desplazamiento horizontal. Fotos nuevas cuadradas y completas. Brochure con lienzo 1120 px y cuatro columnas de galería en escritorio.
- Todas las especialidades de Aliados comprobadas en navegador; no alteran el filtro general. Anterior/siguiente/cerrar y límites de galería correctos. Las cinco ampliaciones nuevas cargan a 1254 × 1254; visor dentro de pantalla móvil.
- Menú móvil, acceso «Ver brochure», navegación interna del Brochure, 14 fotos y visor anterior/siguiente/cerrar comprobados. Enlaces WhatsApp conservan el número y contexto; no se enviaron mensajes ni formularios reales.
- Pruebas de regresión de galería, contacto y chat ejecutadas. No se modifica la integración de envío existente.

## Tanda 05 — cinco fotografías de tableros y medición

Todas están exclusivamente en «Trabajos de los Aliados», filtro «Tableros y medición».

| Archivo original | Prefijo en `assets/img/` |
| --- | --- |
| `02_tablero_medidores_logo_original.png` | `aliados-tablero-medidores-original` |
| `ChatGPT Image 23 sept 2026, 11_07_54 a.m. (9).png` | `aliados-gabinete-medicion-exterior` |
| `ChatGPT Image 23 sept 2026, 11_40_39 a.m.png` | `aliados-acometida-medicion-rural` |
| `ChatGPT Image 23 sept 2026, 11_40_54 a.m.png` | `aliados-gabinete-medidores-abierto` |
| `ChatGPT Image 23 sept 2026, 11_41_12 a.m.png` | `aliados-banco-medidores-interior` |

## Historial de integración

Los apartados siguientes describen estados intermedios y pruebas anteriores. Sus conteos y la instrucción de no publicar quedan sustituidos por el estado de cierre anterior.

## Tanda 01 — fotos integradas previamente

Todas se incorporaron a «Nuestro trabajo», reutilizando los filtros, rejilla y visor existentes. No se atribuyeron ubicaciones, clientes, potencias ni certificaciones que no se hayan confirmado.

| Archivo original | Categoría / filtro | Título del visor | Prefijo de archivo en `assets/img/` |
| --- | --- | --- | --- |
| `01_ascensor_logo_original.png` | Instalaciones internas | Ascensor e iluminación perimetral interior | `interior-ascensor-iluminacion` |
| `1.png` | Instalaciones internas | Iluminación y vitrinas en local comercial | `local-comercial-vitrinas-vista-frontal` |
| `ChatGPT Image 23 sept 2026, 01_38_56 a.m. (5).png` | Instalaciones internas | Iluminación de vitrinas y área comercial | `local-comercial-vitrinas-vista-lateral` |
| `2 - copia.png` | Iluminación | Iluminación lineal y perimetral en interior | `iluminacion-lineal-perimetral-interior` |
| `4.png` | Iluminación | Luminarias lineales en área interior | `iluminacion-luminarias-lineales-interior` |
| `ChatGPT Image 23 sept 2026, 01_11_36 a.m. (3).png` | Iluminación | Montaje de iluminación en local comercial | `iluminacion-montaje-local-comercial` |
| `5.png` | Energía solar | Sistema fotovoltaico en cubierta de teja | `solar-cubierta-teja-vista-aerea` |
| `6.png` | Energía solar | Paneles fotovoltaicos en cubierta metálica | `solar-cubierta-metalica-vista-aerea` |
| `ChatGPT Image 23 sept 2026, 01_38_57 a.m. (9).png` | Energía solar | Sistema fotovoltaico sobre cubierta residencial | `solar-cubierta-residencial-vista-aerea` |

Cada prefijo tiene `-full.webp` y `-thumb.webp`: 18 archivos nuevos. Los originales permanecen sin modificar en la carpeta Pictures indicada por el usuario. El manifiesto `docs/fotos-tanda-01.json` registra nombres originales, SHA-256, categorías, destinos, tamaños y dimensiones, para reconocer duplicados y evitar sobrescrituras.

## Optimización y encuadre

- Versiones ampliadas WebP sin pérdida, 1254 × 1254, verificadas píxel por píxel contra los originales. Conservan logos, marcas de agua, colores y encuadre completo.
- Miniaturas WebP de 640 × 640, calidad 88, con carga diferida. Total de miniaturas: 758422 bytes, unos 758 KB.
- Originales PNG: 20657035 bytes. Versiones ampliadas sin pérdida: 14921266 bytes, aproximadamente 28% menos. Se descargan al abrir el visor, no junto con todas las miniaturas.
- La clase `.gitem-complete` conserva el encuadre de las fotos nuevas y coloca la categoría debajo, sin tapar la imagen. Los estilos de las fotografías anteriores no se alteraron.
- Se versionó la referencia al CSS en la página principal para evitar que una caché anterior recorte las imágenes nuevas.

## Archivos modificados o añadidos

1. `index.html`: nueve tarjetas añadidas, filtros «Instalaciones internas» e «Iluminación», referencia versionada al CSS. Navegación y contenido previo conservados.
2. `assets/css/styles.css`: cuatro reglas limitadas a `.gitem-complete`; sin cambios de marca ni del resto de componentes.
3. `assets/img/`: 18 WebP descritos arriba.
4. `docs/fotos-tanda-01.json`: manifiesto exacto de la tanda.
5. `docs/CONTINUIDAD-FOTOS.md`: este punto de recuperación.
6. `brochure/index.html`: ajuste responsive pendiente de la solicitud inmediatamente anterior, únicamente CSS. Contenedor y cabecera de hasta 1120 px, servicios en dos columnas, galería en dos columnas de tableta y cuatro de escritorio, fotografías completas en pantallas mayores, títulos/espacios adaptados y WhatsApp fuera del área de lectura en escritorio. Contacto tiene margen de ancla para que la cabecera no tape su título. Móvil conserva las dimensiones anteriores.

El archivo preexistente `images/brochure-campo-transformador.png` permanece intacto y fuera de esta tanda. No se debe incorporar por accidente.

## Pruebas completadas en la tanda 01

- Galería principal en 360, 390, 768, 1366 y 1920 px: sin scroll horizontal, imágenes deformadas ni etiquetas cortadas. Filtros «Instalaciones internas» (3), «Iluminación» (3), «Energía solar» (4, incluida la anterior) y «Todos» (29) correctos.
- Las nueve versiones ampliadas cargan en el visor con proporción 1:1 y resolución 1254 × 1254. Flechas anterior/siguiente y cierre comprobados; visor móvil dentro de pantalla.
- Compresión sin pérdida de las nueve versiones ampliadas verificada; logos y originales conservados.
- Brochure en los mismos cinco anchos: sin desbordamiento ni textos recortados; dimensiones móviles iguales a las anteriores; menú, galería, visor y WhatsApp conservados. Sigue sin cargar HubSpot.
- Brochure → Fichas → Volver, en móvil: 7569 px antes y después. Título de Contacto visible por debajo de la cabecera (80 px frente a 65 px de cabecera).
- Auditoría local: 452 referencias internas/anclas en siete HTML, sin referencias inexistentes. Pruebas de contacto existentes satisfactorias.
- No se tocaron HubSpot, Manychat, CRM ni scripts compartidos. El Brochure conserva todo su HTML, enlaces, fotografías y JavaScript previo; solo cambia su CSS.

## Tanda 02 — ocho fotos de Trabajos de los Aliados

Se recibieron siete fotos inicialmente y una foto adicional de trabajo en poste con luminaria durante la integración. Las ocho pertenecen a la tanda `2026-09-23-02` y están registradas en `docs/fotos-tanda-02.json`.

| Archivo original | Contenido visible (solo identificación para continuidad) | Prefijo en `assets/img/` |
| --- | --- | --- |
| `00.png` | Canalización en parqueadero, vista 1 | `aliados-canalizacion-parqueadero-01` |
| `9.png` | Canalización en parqueadero, vista 2 | `aliados-canalizacion-parqueadero-02` |
| `ChatGPT Image 23 sept 2026, 01_38_56 a.m. (6).png` | Cableado en interior | `aliados-cableado-interior` |
| `ChatGPT Image 23 sept 2026, 10_54_43 a.m.png` | Trabajo en poste | `aliados-trabajo-poste` |
| `ChatGPT Image 23 sept 2026, 10_48_17 a.m.png` | Trabajo en poste con luminaria, enviada después | `aliados-trabajo-poste-luminaria` |
| `ChatGPT Image 23 sept 2026, 11_41_28 a.m.png` | Preparación de conexiones de cableado | `aliados-conexiones-cableado` |
| `ChatGPT Image 23 sept 2026, 11_41_42 a.m.png` | Materiales y accesorios de conexión | `aliados-materiales-conexion` |
| `ChatGPT Image 23 sept 2026, 11_41_59 a.m.png` | Organización de materiales de canalización | `aliados-materiales-canalizacion` |

- Cada prefijo tiene `-full.webp` y `-thumb.webp`: 16 archivos nuevos en esta tanda, 34 entre ambas tandas.
- No se añadieron nombres de proyectos ni descripciones comerciales. Las tarjetas y el visor muestran únicamente «Trabajos de los Aliados». Los atributos `alt` describen brevemente lo visible para accesibilidad.
- Originales de esta tanda: 18771160 bytes. Ampliaciones WebP sin pérdida: 12955054 bytes, aproximadamente 31% menos; miniaturas de 640 × 640: 711368 bytes. Las ampliaciones conservan 1254 × 1254 y se verificaron píxel por píxel.
- Los originales, logos y marcas de agua permanecen intactos. No se detectaron duplicados exactos con la tanda 01 ni dentro de la tanda 02.
- Cambios de esta etapa: `index.html` (un filtro y ocho tarjetas), 16 imágenes WebP, `docs/fotos-tanda-02.json` y este documento. Se reutilizaron el CSS y el visor existentes, sin modificar scripts, estilos ni otras páginas en esta etapa.
- Pruebas en 360, 390, 768, 1366 y 1920 px: ocho fotos visibles al filtrar Aliados; sin desbordamiento horizontal, etiquetas cortadas ni deformación. Las ocho ampliaciones cargaron completas, con anterior/siguiente/cerrar funcionando. El visor de la foto adicional se revisó visualmente en móvil de 360 px.
- «Todos» muestra 37 fotos; la tanda 01 conserva sus nueve tarjetas y las 20 originales continúan sin cambios.
- Auditoría local tras la tanda 02: 476 referencias internas en siete páginas, sin errores. `git diff --check` pasó. Se comprobó que, al retirar solo el filtro y las ocho tarjetas nuevas, `index.html` coincide byte por byte con el inicio de esta tanda; los demás archivos previos siguen intactos, salvo la actualización de este documento.
- La optimización responsive del Brochure y el CSS de encuadre de la tanda 01 se conservan tal como estaban al comenzar la tanda 02.

## Tandas 03 y 04 — pendientes y tanda adicional integradas

Se completaron primero las 12 fotografías pendientes de la tanda 03 y luego las 11 adicionales, registradas como tanda 04. Las 37 tarjetas previas se conservaron completas y en su orden. El filtro «Trabajos de los Aliados» reúne ahora 31 fotografías; «Todos» reúne 60.

Se agruparon por especialidad visible, con etiquetas técnicas breves. No se asignaron nombres de obra, clientes, ubicaciones ni resultados. Los manifiestos mantienen `project: null`: no se presupone que fotografías de instalaciones parecidas correspondan a una misma obra. Las vistas permanecen individuales y consecutivas dentro de su especialidad, sin reconstruir la galería ni alterar el visor.

### Tanda 03 — 12 fotografías

| Original | Especialidad | Prefijo de archivo en `assets/img/` |
| --- | --- | --- |
| `ChatGPT Image 23 sept 2026, 01_26_24 a.m. (3).png` | Cámaras y registros | `aliados-registro-conductores` |
| `ChatGPT Image 23 sept 2026, 01_26_27 a.m. (10).png` | Cámaras y registros | `aliados-registro-empalmes` |
| `ChatGPT Image 23 sept 2026, 01_26_25 a.m. (4).png` | Cámaras y registros | `aliados-camara-derivaciones-vista-superior` |
| `ChatGPT Image 23 sept 2026, 01_38_56 a.m. (7).png` | Cámaras y registros | `aliados-camara-derivaciones-zanja` |
| `ChatGPT Image 23 sept 2026, 11_07_48 a.m. (1).png` | Cámaras y registros | `aliados-camara-derivaciones-detalle` |
| `ChatGPT Image 23 sept 2026, 11_07_50 a.m. (5).png` | Canalización y obra civil | `aliados-canalizacion-curvas` |
| `ChatGPT Image 23 sept 2026, 01_38_57 a.m. (8).png` | Canalización y obra civil | `aliados-registro-construccion` |
| `ChatGPT Image 23 sept 2026, 11_07_49 a.m. (4).png` | Canalización y obra civil | `aliados-registro-acabado` |
| `ChatGPT Image 23 sept 2026, 01_26_25 a.m. (6).png` | Tableros y medición | `aliados-tablero-medicion-01` |
| `ChatGPT Image 23 sept 2026, 01_26_26 a.m. (8).png` | Tableros y medición | `aliados-tablero-medicion-02` |
| `ChatGPT Image 23 sept 2026, 01_26_26 a.m. (9).png` | Tableros y medición | `aliados-gabinetes-muro-bloque` |
| `ChatGPT Image 23 sept 2026, 01_38_57 a.m. (10).png` | Tableros y medición | `aliados-tablero-muro-ladrillo` |

Originales: 36196038 bytes; ampliaciones sin pérdida: 25722342 bytes (28.9% menos); miniaturas: 1638460 bytes.

### Tanda 04 — 11 fotografías

| Original | Especialidad | Prefijo de archivo en `assets/img/` |
| --- | --- | --- |
| `ChatGPT Image 23 sept 2026, 01_26_23 a.m. (1).png` | Transformadores y redes | `aliados-transformador-poste-01` |
| `ChatGPT Image 23 sept 2026, 11_07_53 a.m. (8).png` | Transformadores y redes | `aliados-transformador-conexiones` |
| `ChatGPT Image 23 sept 2026, 01_26_24 a.m. (2).png` | Transformadores y redes | `aliados-transformador-poste-02` |
| `ChatGPT Image 23 sept 2026, 01_26_26 a.m. (7).png` | Transformadores y redes | `aliados-transformador-entorno-rural` |
| `ChatGPT Image 23 sept 2026, 11_07_54 a.m. (10).png` | Transformadores y redes | `aliados-transformador-poste-03` |
| `ChatGPT Image 23 sept 2026, 01_26_25 a.m. (5).png` | Transformadores y redes | `aliados-transformador-entorno-construccion` |
| `ChatGPT Image 23 sept 2026, 01_38_55 a.m. (3).png` | Transformadores y redes | `aliados-transformador-altura-01` |
| `ChatGPT Image 23 sept 2026, 01_38_55 a.m. (4).png` | Transformadores y redes | `aliados-transformador-altura-02` |
| `ChatGPT Image 23 sept 2026, 11_07_49 a.m. (3).png` | Transformadores y redes | `aliados-transformador-montaje` |
| `ChatGPT Image 23 sept 2026, 11_07_51 a.m. (7).png` | Transformadores y redes | `aliados-transformador-estructura` |
| `ChatGPT Image 23 sept 2026, 11_40_15 a.m.png` | Transformadores y redes | `aliados-transformador-equipo-altura` |

Originales: 22593058 bytes; ampliaciones sin pérdida: 16569804 bytes (26.7% menos); miniaturas: 832210 bytes.

- Las 23 ampliaciones WebP conservan 1254 × 1254 y se verificaron píxel por píxel. Las miniaturas de 640 × 640 tienen calidad 88 y carga diferida. Se mantienen encuadre, logos, marcas de agua y fechas impresas.
- Comprobación de duplicados: hashes de originales contra las tandas anteriores y entre las nuevas; además, comparación perceptual con las ampliaciones existentes. Sin duplicados detectados. Las diferentes vistas se conservaron.
- Archivos tocados en esta etapa: `index.html` (23 tarjetas añadidas), 46 WebP nuevos en `assets/img/`, `docs/fotos-tanda-03.json`, `docs/fotos-tanda-04.json` y este documento. No se cambió CSS, JavaScript, CRM, bots, navegación ni otras páginas.
- Validación de alcance: al retirar las 23 tarjetas nuevas, `index.html` coincide byte por byte con el inicio de esta etapa. Los originales y activos anteriores conservaron sus hashes.
- Pruebas en 360, 390, 768, 1366 y 1920 px: las 23 fotos nuevas mantienen formato cuadrado y encuadre completo, sin scroll horizontal ni etiquetas cortadas. Las 23 miniaturas y las 23 ampliaciones cargaron correctamente; el visor conserva anterior, siguiente y cerrar. «Trabajos de los Aliados» muestra 31 imágenes y «Todos» muestra 60; las tandas 01 y 02 mantienen sus nueve y ocho fotos.
- Auditoría de 545 referencias internas en siete páginas: sin archivos ni anclas inexistentes. `git diff --check` pasó. No se probaron envíos ni se alteraron contactos, CRM o bots; esta etapa solo incorpora fotografías a la galería.
- No se realizó commit, push ni publicación. El ajuste previo del Brochure continúa guardado sin cambios. En total, las cuatro tandas contienen 40 fotos nuevas y 80 WebP.

## Cómo continuar

1. Revisar `git status`, este documento y los cinco manifiestos; conservar cambios locales ajenos a la tarea.
2. Para nuevas tandas, comprobar hashes y similitud visual antes de crear tarjetas. Conservar ángulos distintos y el contenido original; no atribuir proyectos sin confirmación.
3. Las fotos de Aliados van solo en `#trabajos-aliados`; las generales en `#trabajo`. Reutilizar filtros y visor y crear un manifiesto nuevo para la tanda.
4. Para integrar un formulario HubSpot, se necesita su código real de inserción o identificador y configuración pública confirmada. No deducirlo del portal del chat ni sustituir FormSubmit sin esos datos.
5. Antes de otra publicación, ejecutar pruebas, revisar el alcance del commit y comprobar GitHub Pages. No incluir archivos privados, credenciales ni el PNG local ajeno mencionado arriba.

Vista local: iniciar un servidor estático desde la raíz en el puerto 8765 y abrir `http://127.0.0.1:8765/#trabajos-aliados`.
