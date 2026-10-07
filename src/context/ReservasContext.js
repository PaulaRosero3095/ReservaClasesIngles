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
        cargar();
    }, [])

    //Hacer el guardado
    useEffect(()=>{
        if(cargando) return;
        AsyncStorage.setItem(CLAVE_RESERVAS, JSON.stringify(reservas)).catch((error) =>
            console.log('Error al guardar reservas: ', error)
        );
    },[reservas, cargando]);

    const agregarReserva = useCallback((clase, horario) =>{
        const id = clase.id + '-' + horario;

        //Revisar duplicados ANTES de guardar, así el resultado es correcto
        if(reservas.some((r) => r.id === id)){
            return { ok: false };
        }

        const nueva ={
            id,
            titulo: clase.titulo,
            nivel: clase.nivel,
            profesor: clase.profesor.nombre,
            precio: clase.precio,
            horario,
            creadoEn: new Date().toISOString()
        };
        setReservas((previas) => [nueva, ...previas]);
        return { ok: true };
    },[reservas]);//Cierre del callBack

    const valor = useMemo(
        () => ({cargando, agregarReserva, reservas}),
        [cargando, agregarReserva, reservas]
    );

    return <ReservasContext.Provider value={valor}>{children}</ReservasContext.Provider>

}; //Esta es la llave de cierre para la función