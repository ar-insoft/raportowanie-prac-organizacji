import React, { useState, useEffect, useRef } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useQuery, useMutation, useQueryClient, QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { IntlProvider } from 'react-intl'
//import _ from 'lodash'
import './RaportujPraceOrganizacji.css'
import { messagesOf } from '../tools/i18nConfig'
import { consts, DataProvider } from './DataProvider'
import { ustawGodzinyRopoczeciaZakonczenia } from './DataIGodziny'
import { PanelSemantic } from './PanelSemantic';
import { ZapisanoPraceModal } from './ZapisanoPraceModal'
//import { from } from 'rxjs';

const queryClient = new QueryClient()

export const RaportujPraceOrganizacji = () => {
    const parsedUrl = new URL(window.location.href)
    const lang = parsedUrl.searchParams.get("lang") || "pl"

    const [isLoading, setIsLoading] = useState(false)
    const [isZapisanoPraceModalOpen, setZapisanoPraceModalOpen] = React.useState(false)
    const [ostatnioZapisanaPraca, setOstatnioZapisanaPraca] = useState(null)
    //const [zapisanePrace, setZapisanePrace] = useState([])

    const [pracownicy, setPracownicy] = useState([])
    const [pracownik, setPracownik] = useState(null)

    const [zlecenieWybrane, setZlecenieWybrane] = useState(null)
    const refZlecenie = useRef(null);

    const [rodzajLista, setRodzajLista] = useState(null)
    const [rodzaj, setRodzaj] = useState(null)
    const refElement = useRef(null);

    const [opis, setOpis] = useState('')

    const [data, setData] = useState(null)
    const refDate = useRef(null);
    const [godzinaStart, setGodzinaStart] = useState(null)
    const [godzinaEnd, setGodzinaEnd] = useState(null)
    const [przepracowano, setPrzepracowano] = useState(null)

    const [moznaZapisac, setMoznaZapisac] = useState(false)

    useEffect(() => {
        loadPracownicy()
        loadRodzajLista()
    }, [])
    useEffect(() => {
        const zdefiniowaneObiekty = pracownik && pracownik.id > 0 && zlecenieWybrane && rodzaj && data && godzinaStart && godzinaEnd
        const canSave = !!zdefiniowaneObiekty
        //console.log('canSave', canSave)
        setMoznaZapisac(canSave)
    }, [pracownik, zlecenieWybrane, rodzaj, data, godzinaStart, godzinaEnd])

    async function loadPracownicy() {
        setIsLoading(true)
        const jsonName = consts.ENDPOINT_URL + '?action=pobierz_pracownikow_json'
        const response = await fetch(jsonName);
        const myJson = await response.json();
        //console.log('myJson', myJson)
        setIsLoading(false)
        setPracownicy(myJson)
    }

    async function loadRodzajLista() {
        const jsonName = consts.ENDPOINT_URL + '?action=pobierz_rodzaj_lista_json'
        const response = await fetch(jsonName);
        const myJson = await response.json();
        setRodzajLista(myJson)
        if (myJson.length > 0) {
            // domyslne wybranie glowego elementu
            //setElementWybrany(myJson[myJson.length-1])
        }
        //refElement.current.tryOpen()
    }

    const callbacks = {
        setLoadind: (loading) => setIsLoading(loading),
        setZapisanoPraceModalOpen: (open) => setZapisanoPraceModalOpen(open),
        wybierzPracownika: (pracownik) => {
            setPracownik(pracownik)
            if (pracownik) {
                if (pracownik.planDnia) {
                    if (pracownik.planDnia.zlecenie) {
                        setZlecenieWybrane(pracownik.planDnia.zlecenie)
                    }
                    ustawGodzinyRopoczeciaZakonczenia(pracownik.planDnia.start_time, pracownik.planDnia.end_time, {params, callbacks})
                }
                document.getElementById('rodzaj_select').focus()
            }
        },
        wybierzRodzaj: (rodzaj) => {
            setRodzaj(rodzaj)
            if (rodzaj) {
                document.getElementById('zlecenie_search').focus()
                console.log('wybierzRodzaj', rodzaj)
            }
        },
        wybierzZlecenie: (zlecenie) => {
            setZlecenieWybrane(zlecenie)
            if (zlecenie) refDate.current.focus()
        },
        wybierzDate: (dzien) => {
            setData(dzien)
        },
        wybierzGodzineRozpoczecia: (czas) => {
            setGodzinaStart(czas)
        },
        wybierzGodzineZakonczenia: (czas) => {
            setGodzinaEnd(czas)
        },
        wybierzPrzepracowano: (czas) => {
            setPrzepracowano(czas)
        },
        ustawOpis: (opis) => {
            setOpis(opis)
            console.log('ustawOpis', opis)
        },
        zapiszPrace: () => {
            setIsLoading(true)
            DataProvider.wyslijNaSerwer(
                {
                    employeeId: pracownik.id,
                    rodzaj: rodzaj,
                    zlecenieId: zlecenieWybrane.id,
                    date: data.format("yyyy-MM-DD"),
                    start_task_time: godzinaStart.format("HH:mm") + ":00",
                    end_task_time: godzinaEnd.format("HH:mm") + ":00",
                    opis: opis,
                },
                fromServer => {
                    //console.log('zapiszPrace fromServer', fromServer)
                    setZapisanoPraceModalOpen(true)
                    setOstatnioZapisanaPraca(fromServer.zapisanaPraca)
                    setIsLoading(false)
                }, error => {
                    //console.log('zapiszPrace error', error)
                    wyswietlKomunikatBledu(error)
                    setIsLoading(false)
                })
        },
        poZapisieWprowadzKolejnaPrace: () => {
            //window.location.assign('/eoffice/react/raportowanie_zakonczonych_prac/index.html');
            //setZlecenieWybrane(null)
            //setRodzaj(null)
            setGodzinaStart(godzinaEnd)
            setGodzinaEnd(null)
            setPrzepracowano(null)
        },
        poZapisieWyczysc: () => {
            //window.location.assign('/eoffice/react/raportowanie_zakonczonych_prac/index.html');
            setPracownik(null)
            setZlecenieWybrane(null)
            setRodzaj(null)
            setData(null)
            setGodzinaStart(null)
            setGodzinaEnd(null)
            setPrzepracowano(null)
            setOpis('')
        }
    }
    const params = {
        isLoading: isLoading,
        isZapisanoPraceModalOpen,
        ostatnioZapisanaPraca,

        pracownicy,
        pracownik,
        zlecenieWybrane,
        refZlecenie,

        rodzaj,
        rodzajLista,
        refElement,

        opis,

        refDate,
        data,
        godzinaStart,
        godzinaEnd,
        przepracowano,

        moznaZapisac,
    }
    const wyswietlKomunikatBledu = error => {
        toast.error(<span>Błąd: {trescKomunikatuBledu(error)}</span>);
    }

    const trescKomunikatuBledu = error => {
        if (typeof error === 'undefined') return 'server_error'
        const { error_message, errorCause } = error
        let komunikatBledu = error_message || errorCause || ''
        if (typeof komunikatBledu === 'object') {
            komunikatBledu = 'server_error'
        }
        return komunikatBledu
    }

    return (
        <QueryClientProvider client={queryClient}>
            <IntlProvider locale={lang} messages={messagesOf(lang)}>
                <div className="mainPanel">
                    <header id="main_header">
                        Raportuj pracę organizacji
                    </header>
                    <PanelSemantic params={params} callbacks={callbacks} />
                </div>
                <ToastContainer
                    position={toast.POSITION.TOP_RIGHT}
                    closeOnClick={false}
                    autoClose={6000}
                    hideProgressBar={true}
                />
                <ZapisanoPraceModal params={params} callbacks={callbacks} />
            </IntlProvider>
            <ReactQueryDevtools initialIsOpen={false} />
        </QueryClientProvider>
    )
}