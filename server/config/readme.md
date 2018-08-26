API CONFIGURATION
====================
Existen 4 tipos de configuraciones disponibles

- **Constantes**: Están definidas en el directorio config/constants/ en formato JSON, se recomienda un archivo JSON diferente por entidad para mantener el orden.
- **DataSource**: Acá se define el conector que se utiliza para cada BD.
- **Environment**: Este directorio se utiliza para almacenar las variables propias del Ambiente donde se ejecutará la API. 
- **Express**: En el archivo express.conf.js se agregan todos los plugins que serán necesarios para la aplicación.


----------
¿Como utilizar ApiConfig?
---------------
Desde cualquier archivo del proyecto se puede invocar de la siguiente forma:
>-Importar el archivo de configuraciones (ruta relativa al directorio donde estoy)
	 <pre> const ApiConfig = require('../../config/');</pre>
>-Para obtener las configuraciones de Environment
	 <pre> ApiConfig.getEnv();</pre>
>-Para obtener las constantes Globales
	 <pre> ApiConfig.getAllConstants();</pre>