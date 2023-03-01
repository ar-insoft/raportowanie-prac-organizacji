import React from 'react';
import { Icon, Modal, Button } from 'semantic-ui-react'
import classNames from 'classnames/bind'

export const ZapisanoPraceModal = ({ params, callbacks }) => {
    const { isLoading, isZapisanoPraceModalOpen, ostatnioZapisanaPraca, } = params;
    const openModal = isZapisanoPraceModalOpen

    const setOpenModal = (open) => {
        callbacks.setZapisanoPraceModalOpen(open)
    }

    return (
        <Modal
            //onClose={() => setOpenModal(false)}
            onOpen={() => setOpenModal(true)}
            open={openModal}
        //trigger={<Button>Show Modal</Button>}
        >
            <Modal.Header>Zapisano pracę</Modal.Header>
            {
                ostatnioZapisanaPraca &&
                <Modal.Content>
                    <Modal.Description>
                        {/* <Header>Default Profile Image</Header> */}
                        <p>Pracownik: {ostatnioZapisanaPraca.employee}</p>
                        <p>Rodzaj: {ostatnioZapisanaPraca.rodzaj}</p>
                        <p>Zlecenie: {ostatnioZapisanaPraca.order.object_index + ' ' + ostatnioZapisanaPraca.order.title}</p>
                        <p>Czas pracy: {ostatnioZapisanaPraca.date + ' ' + ostatnioZapisanaPraca.start_time + ' - ' + ostatnioZapisanaPraca.end_time}</p>
                    </Modal.Description>
                </Modal.Content>
            }
            <Modal.Actions>
                <Button
                    content="OK, zapisz kolejną dla pracownika"
                    labelPosition='right'
                    icon='checkmark'
                    onClick={() => {
                        setOpenModal(false);
                        callbacks.poZapisieWprowadzKolejnaPrace();
                    }}
                    positive
                />
                <Button color='black' onClick={() => {
                    setOpenModal(false);
                    callbacks.poZapisieWyczysc()
                    //window.location.assign('/eoffice/production/raport_prac_zakonczonych.xml?action=list&refreshTree=false&go=false&changetree=false');
                }}>
                    Powrót
                    </Button>
                {/* <Button color='black' onClick={() => {
                    setOpenModal(false);
                }}>
                    Zamknij
                    </Button> */}
            </Modal.Actions>
        </Modal>
    )
}