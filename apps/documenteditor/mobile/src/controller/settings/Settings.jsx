import React, {useEffect} from 'react';
import { useTranslation } from 'react-i18next';
import {f7} from 'framework7-react';
import { observer, inject } from "mobx-react";
import {Device} from '../../../../../common/mobile/utils/device';

import SettingsView from "../../view/settings/Settings";

const Settings = props => {
    useEffect(() => {
        if ( Device.phone ) {
            f7.popup.open('.settings-popup');
        } else {
            f7.popover.open('#settings-popover', '#btn-settings');
        }

        return () => {
            // component will unmount
        }
    });

    const onviewclosed = () => {
        if ( props.onclosed )
            props.onclosed();
    };

    const closeModal = () => {
        if (Device.phone) {
            f7.sheet.close('.settings-popup');
        } else {
            f7.popover.close('#settings-popover');
        }
    };

    const onReaderMode = () => {
        const appOptions = props.storeAppOptions;
        appOptions.changeReaderMode();

        Common.EditorApi.get().ChangeReaderMode();

        if (Device.phone) {
            setTimeout(() => {
                closeModal();
            }, 1);
        }
    }

    const onPrint = () => {
        setTimeout(() => {
            Common.EditorApi.get().asc_Print();
        }, 1);
        closeModal();
    }

    return <SettingsView usePopover={!Device.phone} onclosed={onviewclosed} onReaderMode={onReaderMode} onPrint={onPrint}/>
};

export default inject("storeAppOptions")(observer(Settings));