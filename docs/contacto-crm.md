# Contacto y CRM — revisión del 22–23 de septiembre de 2026

## Estado comprobado

- Número conservado: +57 301 616 8670. Correo conservado: kvaretie.energy@gmail.com.
- 20 accesos WhatsApp contextualizados. Se conservan cabeceras, menú móvil, accesos de información, asesoría y contacto. Se quitaron dos accesos WhatsApp redundantes del footer de Web y otros dos de Aliados; permanece el botón de asesoría en cada footer. En Fichas se quitó el botón grande duplicado, conservando la tarjeta con el teléfono y su enlace.
- Un único acceso flotante: HubSpot cuando el widget confirma su carga; WhatsApp como respaldo y como flotante permanente del Brochure. Se oculta cuando el acceso de contacto equivalente está visible y, en móvil, mientras el formulario de Aliados está en pantalla. No se asigna ningún servicio por scroll: los observadores solo evitan superposiciones visuales.
- Auditoría inicial, anterior a la actualización comunicada por Cloud: HubSpot, portal público 51934019, apareció y aceptó una conversación de prueba. Al seleccionar «Quiero ser aliado» respondió preguntando por servicios eléctricos. Al explicar que era una prueba y solicitar el retorno al formulario, pidió el nombre en lugar de resolver la consulta. No se completó una oportunidad comercial.
- Continuación solicitada: Cloud informa que configuró el bot general con exclusión de /aliados/ y un bot exclusivo para esa ruta, más el fragmento #formularioaliados. No se modifican esos bots. La interfaz usa el mismo portal y el modo compatible `inlineEmbedSelector` del SDK dentro de un diálogo: precarga el widget sin mostrarlo, habilita el botón de chat tras widgetLoaded y abre la ventana solo con un clic. Al cerrar, vuelve al lanzador único. Si no carga el script o el widget, queda WhatsApp; ante un fallo de apertura se recupera el respaldo. No se borran conversaciones ni se cambia de hilo automáticamente.
- Se observó carga de `collectedforms.js` por HubSpot. Eso no prueba que el formulario AJAX cree contactos en el CRM. No se implementó ni se afirma sincronización automática.
- El panel HubSpot solicita iniciar sesión. El registro en bandeja y asociaciones de contactos no se verificaron directamente desde esta sesión; Cloud informa que probó ambos bots. Cloud confirma que WhatsApp y FormSubmit todavía no están integrados con HubSpot. Una respuesta del widget no acredita por sí sola el registro interno del CRM.
- FormSubmit: el envío de prueba desde producción fue aceptado y su correo se verificó en el buzón corporativo (identificador de prueba `QA-20260922-PUBLICA`, 22/09/2026, 13:44 Bogotá). La prueba local mostró el error esperado: FormSubmit pidió activar 127.0.0.1. No se activó el origen local.

## Fuente única y mantenimiento

Editar `assets/js/contact.js` y ejecutar `node scripts/sync-contact.cjs`, seguido de `node scripts/contact.test.cjs` y `node scripts/chat.test.cjs`. Los HTML conservan enlaces reales y mensajes correctos incluso sin JavaScript. Los atributos `data-contact-origin` identifican cada acceso; el teléfono y los textos se mantienen en una sola configuración.

El estado «solicitud enviada» se guarda únicamente después de una respuesta positiva de FormSubmit, en la sesión del navegador y sin datos personales. Al regresar se muestra el agradecimiento existente y los enlaces de asesoría dicen que ya se envió la solicitud. No acredita recepción individual en el buzón ni aprobación de la alianza. No se puede reconocer automáticamente un envío de otro dispositivo o de una sesión anterior.

## Mapa de accesos

Las rutas de retorno de esta tabla se resuelven bajo https://kvaretieenergy-rgb.github.io/kvaretie-web/ . Los enlaces de WhatsApp abren el canal externo; la navegación interna y «Volver» conservan el historial existente.

| Origen | Botón / ubicación | Mensaje inicial | Tipo de consulta | Retorno |
| --- | --- | --- | --- | --- |
| `web_general` | Asesor de cabecera, menú, hero, acceso rápido, footer y flotante (6) | Hola, estoy visitando la página de KVARETIE y tengo una consulta sobre sus servicios. | Servicios / proyecto por precisar | `/` o punto de origen del historial |
| `contacto_general` | Asesor de la sección Contacto de Web (1) | Hola, quisiera comunicarme con un asesor de KVARETIE. | Contacto general | `/#contacto` |
| `presentacion` | Contactar por WhatsApp, tarjeta del teléfono y flotante (3) | Hola, vi la presentación digital de KVARETIE y quisiera consultar sobre un proyecto. | Proyecto por precisar | `/presentacion/` |
| `red_aliados` | Asesor de cabecera, menú móvil, error de formulario, footer y flotante (5) | Hola, estoy revisando la Red de Aliados de KVARETIE y tengo una duda antes de enviar mi solicitud. | Duda sobre alianza | `/aliados/#formulario` |
| `red_aliados` después del envío | Los mismos accesos de Aliados | Hola, ya envié mi solicitud a la Red de Aliados de KVARETIE y tengo una consulta sobre ella. | Seguimiento de solicitud | `/aliados/#formulario`, sin solicitar otro envío |
| `brochure` | Solicitar asesoría, contacto inferior y flotante (3) | Hola, estoy revisando el brochure de KVARETIE y necesito orientación. | Orientación | `/brochure/` |
| `fichas_informativas` | Tarjeta WhatsApp y flotante (2) | Hola, estoy consultando las fichas informativas de KVARETIE y tengo una pregunta sobre sus soluciones. | Soluciones por precisar | `/fichas-informativas/#contacto` |
| `servicio_especifico` | Reservado para un CTA asociado explícitamente a un servicio; actualmente no existen CTA de este tipo | Hola, estoy consultando el servicio de [servicio] de KVARETIE y necesito asesoría. | Servicio indicado por el visitante | URL y ancla del CTA |

Para un futuro CTA específico usar `data-contact-origin="servicio_especifico"` y `data-contact-service="Nombre del servicio"`; no asociarlo al flotante por haber recorrido una sección. Si falta el servicio, se usa contacto general. No se añadieron nuevos botones comerciales.

## Reglas para configurar el agente en HubSpot

Referencia para el asesor y futuras integraciones. No se modificaron los bots, propiedades, pipeline ni automatizaciones configurados por Cloud.

1. Reconocer el origen conocido por la URL de entrada y/o el mensaje explícito. Si no se conoce, preguntar brevemente qué necesita. No volver a pedir lo ya indicado.
2. En `red_aliados`, resolver la duda de colaboración antes de pedir datos comerciales. No preguntar por una instalación eléctrica salvo que el visitante cambie expresamente de tema.
3. Después de resolver la duda, ofrecer https://kvaretieenergy-rgb.github.io/kvaretie-web/aliados/#formulario . Si ya envió la solicitud, conservar ese acceso para volver, sin invitar a completar otro formulario ni prometer una aprobación.
4. No atribuir servicios por desplazamiento ni cambiar el origen de una conversación existente solo porque el usuario navegue a otra página. El origen inicial y la página actual deben ser campos distintos.
5. No prometer que WhatsApp o FormSubmit alimentan el CRM hasta confirmar su integración. No dar por recibida una solicitud basándose solo en que abrió WhatsApp.

## Integración real y datos pendientes de Cloud

El SDK oficial admite selección por URL y `widget.refresh()`; la URL de Presentación apareció en el iframe inspeccionado. Esto sirve para dirigir chatflows, pero no prueba que una propiedad personalizada de origen se guarde. No se usan parámetros de metadatos inventados ni se envían datos personales a analítica. Documentación: [Conversations SDK](https://developers.hubspot.com/docs/api-reference/latest/conversations/chat-configuration/chat-widget-sdk).

`wa.me` abre WhatsApp con texto predefinido. La conexión de WhatsApp Business con la bandeja es una integración independiente que debe comprobarse dentro de HubSpot: [conectar WhatsApp](https://knowledge.hubspot.com/inbox/connect-whatsapp-to-the-conversations-inbox). No hay credenciales privadas en el repositorio.

Preparación de asignación, pendiente de los nombres internos y reglas definitivos del CRM:

| Dato lógico | Valor / fuente | Estado de implementación |
| --- | --- | --- |
| Origen | Los siete identificadores del mapa | Atributo en cada CTA; `ORIGEN=red_aliados` en correo del formulario |
| Interés | `alianza` en formulario; servicio explícito en CTA específico | `INTERÉS=alianza` en correo; no se infiere un servicio |
| Estado | `consulta`, `solicitud_enviada`, `en_revision`, `resuelta` | Formulario envía `solicitud_enviada`; los demás son propuesta CRM |
| Retorno | URL/ancla del mapa | `RETORNO` en correo de Aliados; reglas preparadas para el agente |
| Estado confirmado | Respuesta de FormSubmit frente a recepción/integración CRM | Se mantienen como evidencias distintas |

Pendiente para una futura integración: nombres internos definitivos de propiedades, pipeline/etapas y responsables; futura conexión de WhatsApp Business; mecanismo FormSubmit→CRM y deduplicación; tratamiento de consentimiento y retención. Los bots y el fragmento #formularioaliados ya están configurados según Cloud. Una eventual API privada deberá ejecutarse del lado servidor, nunca en GitHub Pages.

La selección del bot depende de las reglas remotas por URL que Cloud configuró. Un hilo previo puede seguir abierto al cambiar de página; no se elimina su historial ni se fuerza una nueva conversación. Brochure continúa sin cargar el script HubSpot.

## Pruebas

- Cinco páginas en 360, 390 y 1366 px: sin desbordamiento horizontal; mensajes correctos; ningún segundo flotante simultáneo.
- Menú móvil Aliados, formulario visible y foco de escritura: contacto contextual y campos libres del flotante.
- 425 referencias internas y anclas revisadas en siete HTML: sin referencias inexistentes. Imágenes, CSS embebido y enlaces comparados con la versión estable `bdf2b3c`: sin cambios. Los elementos de imagen vacíos de las galerías son marcadores ocultos hasta abrir una fotografía.
- Validación real: ocho campos/requisitos vacíos; teléfono y correo inválidos rechazados. No se envió una solicitud inválida.
- Tests aislados: éxito, rechazo de servicio, HTTP de error, fallo de red, estado previo y contexto de servicio explícito.
- Fichas→Aliados→Volver móvil: posición 12631 px antes y después. Lógica de navegación original conservada byte por byte, normalizando finales de línea.
- FormSubmit público: mensaje de éxito y recepción comprobada por Gmail. Pruebas identificadas como técnicas/no comerciales, sin datos de clientes.

Los resultados de despliegue y la comprobación final en producción se entregan junto al commit; no deben confundirse con la integración del CRM pendiente.

## Beneficios e información institucional

La versión estable previa es `bdf2b3cce0855ecec0726ceb621387496fff1ca5`, conservada en el historial. Se reutiliza su centralización de mensajes, validaciones y estado de envío.

Aliados concentra los cuatro beneficios confirmados: descuentos exclusivos, posibles ingresos por referidos, ampliación de la red de contactos y participación en proyectos. Se agrupan en beneficios comerciales y oportunidades de colaboración, integrando el acompañamiento técnico, la orientación para certificaciones y la optimización de costos. Se mantienen las condiciones y la ausencia de garantías. Web, Presentación, Brochure y los bloques existentes de Aliados en Fichas incluyen invitaciones breves; no se agregan CTA repetidos ni publicidad a cada ficha.

El [resumen para el bot de Aliados](beneficios-aliados-hubspot.md) contiene respuestas listas para incorporar posteriormente en HubSpot. No se reinstala ni modifica el bot configurado por Cloud.

Los datos institucionales provienen de la transcripción suministrada por la empresa del certificado de Cámara de Comercio expedido el 16/04/2026: razón social, nombre comercial, NIT, domicilio, matrícula y entidad de registro. Se indica su fecha y no se presenta como verificación actual en tiempo real. No se publicó el documento, información privada ni una trayectoria de quince años. Nuevas fotografías y dominio propio quedan fuera de esta etapa.
