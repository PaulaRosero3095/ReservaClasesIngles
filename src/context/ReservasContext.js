import React, {useState, useEffect, useCallback, useMemo, createContext} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const CLAVE_RESERVAS = '@reservas_ingles';

export const ReservasContext = createContext(null);

export function ReservaProvider({children}){
    const [reservas, setReservas]=useState([]);
    const [cargando, setCargando] = useState(true);

    //Cargar las reservas que tengo guardadas, sino tengo nada me devuelve un arreglo vacio
    useEffect(()=>{
        const cargar = async () =>{
            try{
                const guardado = await AsyncStorage.getItem(CLAVE_RESERVAS);
                if(guardado !== null){
                    setReservas(JSON.parse(guardado))
                }

            }catch(error){
                console.log('Error leyendo reservas: ', error);
            }finally{
                setCargando(false);
            }    
        };
    }, [])

    //Hacer el guardado
    useEffect(()=>{
        if(cargando) return;
        AsyncStorage.setItem(CLAVE_RESERVAS, JSON.stringify(reservas)).catch((error) =>
            console.log('Error al guardar reservas: ', error)
        );
    },[reservas, cargando]);

    const agregarReserva = useCallback((clase, horario) =>{
        const nueva ={
            id: clase.id + '-' + horario,
            titulo: clase.titulo,
            nivel: clase.nivel,
            profesor: clase.profesor.nombre,
            precio: clase.precio,
            horario,
            creadoEn: new Date().toISOString()
        };
        let resultado = {ok: true}
        setReservas((previas) =>{
            if(previas.some((r) => r.id === nueva.id)){
                resultado = {ok: false}
                return previas;
            }
            return[nueva, ...previas]
        });//setReservas
        return resultado
    },[]);//Cierre del callBack

const valor = useMemo(
    () => ({cargando, agregarReserva, reservas})
    [cargando,agregarReserva, reservas]
)
return <ReservasContext.Provider>{children}</ReservasContext.Provider>

}; //Esta es la llave de cierre para la función