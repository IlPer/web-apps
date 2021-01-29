import React, {Component, useEffect} from 'react';
import {View,Page,Navbar,NavRight,Link,Popup,Popover,Icon,Tabs,Tab} from 'framework7-react';
import { useTranslation } from 'react-i18next';
import {f7} from 'framework7-react';
import { observer, inject } from "mobx-react";
import {Device} from '../../../../../common/mobile/utils/device';

import AddChartController from "../../controller/add/AddChart";
import AddFormulaController from "../../controller/add/AddFormula";
//import AddShapeController from "../../controller/add/AddShape";
//import {AddOtherController} from "../../controller/add/AddOther";

const routes = [
];

const AddLayoutNavbar = ({ tabs, inPopover }) => {
    const isAndroid = Device.android;
    return (
        <Navbar>
            <div className='tab-buttons tabbar'>
                {tabs.map((item, index) =>
                    <Link key={"sse-link-" + item.id} tabLink={"#" + item.id} tabLinkActive={index === 0}>
                        <Icon slot="media" icon={item.icon}></Icon>
                    </Link>)}
                {isAndroid && <span className='tab-link-highlight' style={{width: 100 / tabs.lenght + '%'}}></span>}
            </div>
            { !inPopover && <NavRight><Link icon='icon-expand-down' popupClose=".add-popup"></Link></NavRight> }
        </Navbar>
    )
};

const AddLayoutContent = ({ tabs }) => {
    return (
        <Tabs animated>
            {tabs.map((item, index) =>
                <Tab key={"sse-tab-" + item.id} id={item.id} className="page-content" tabActive={index === 0}>
                    {item.component}
                </Tab>
            )}
        </Tabs>
    )
};

const AddTabs = props => {
    const { t } = useTranslation();
    const _t = t('Add', {returnObjects: true});
    const showPanels = props.showPanels;
    const tabs = [];
    if (!showPanels) {
        tabs.push({
            caption: _t.textChart,
            id: 'add-chart',
            icon: 'icon-add-chart',
            component: <AddChartController/>
        });
    }
    if (!showPanels || showPanels === 'formula') {
        tabs.push({
            caption: _t.textFormula,
            id: 'add-formula',
            icon: 'icon-add-formula',
            component: <AddFormulaController/>
        });
    }
    /*tabs.push({
        caption: _t.textShape,
        id: 'add-shape',
        icon: 'icon-add-shape',
        component: <AddShapeController />
    });
    tabs.push({
        caption: _t.textOther,
        id: 'add-other',
        icon: 'icon-add-other',
        component: <AddOtherController />
    });*/
    return (
        <View style={props.style} stackPages={true} routes={routes}>
            <Page pageContent={false}>
                <AddLayoutNavbar tabs={tabs} inPopover={props.inPopover}/>
                <AddLayoutContent tabs={tabs} />
            </Page>
        </View>
    )
};

class AddView extends Component {
    constructor(props) {
        super(props);

        this.onoptionclick = this.onoptionclick.bind(this);
    }
    onoptionclick(page){
        f7.views.current.router.navigate(page);
    }
    render() {
        const show_popover = this.props.usePopover;
        return (
            show_popover ?
                <Popover id="add-popover" className="popover__titled" onPopoverClosed={() => this.props.onclosed()}>
                    <AddTabs inPopover={true} onOptionClick={this.onoptionclick} style={{height: '410px'}} showPanels={this.props.showPanels}/>
                </Popover> :
                <Popup className="add-popup" onPopupClosed={() => this.props.onclosed()}>
                    <AddTabs onOptionClick={this.onoptionclick} showPanels={this.props.showPanels}/>
                </Popup>
        )
    }
}

const Add = props => {
    useEffect(() => {
        if ( Device.phone ) {
            f7.popup.open('.add-popup');
        } else {
            const targetElem = !props.showOptions ? '#btn-add' : props.showOptions.button;
            f7.popover.open('#add-popover', targetElem);
        }

        return () => {
            // component will unmount
        }
    });
    const onviewclosed = () => {
        if ( props.onclosed )
            props.onclosed();
    };
    return <AddView usePopover={!Device.phone}
                    onclosed={onviewclosed}
                    showPanels={props.showOptions ? props.showOptions.panels : undefined}
    />
};

export default Add;