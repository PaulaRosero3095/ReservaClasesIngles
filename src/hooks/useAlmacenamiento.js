import { useState, useEffect, useCallback, use } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Hook personalizado para manejar el almacenamiento local de datos en la aplicación.
// Permite guardar y recuperar datos de manera persistente usando AsyncStorage.
export default function useAlmacenamiento(clave, valorInicial) {
    const [valor, setValor] = useState(valorInicial);
    const [listo, setListo] = useState(false);

    useEffect(() => {
        let activo = true; //esto es una bandera para saber si estoy guardando el componente p montando el componente

        AsyncStorage.getItem(clave)
        .then((guardando) =>{
            if (activo && guardando !== null) setValor(JSON.parse(guardando)); 
        })
        .catch((error) => console.log('Error leyendo ' + clave, error))
        .finally(() => activo && setListo(true));

        return () => { activo = false;  
        }; //esto es para limpiar el efecto cuando se desmonte el componente

    },[clave]);

    const actualizar = useCallback(
        async (nuevoValor) => {
            setValor(nuevoValor);
            try {
                await AsyncStorage.setItem(clave, JSON.stringify(nuevoValor));
            }catch(error){
                console.log('Error guardado' + clave, error)
            };
        }, [clave]
    );
};