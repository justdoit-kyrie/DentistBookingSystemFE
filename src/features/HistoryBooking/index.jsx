import { Badge, Box } from '@chakra-ui/react';
import React, { useState, useEffect } from 'react';
import { withTranslation } from 'react-i18next';
import HeaderOnlyLayout from '~/components/layouts/HeaderOnlyLayout';
import './HistoryBooking.scss';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { selectLoggedUser } from '../Auth/authSlice';
import { useSelector } from 'react-redux';
import { axios } from '~/apis';
import { API_ROUTES, SCHEDULE_TIMER, STATUS_CODE } from '~/app/constants';
import moment from 'moment';

const HistoryBookingPage = () => {
  const [expandedRows, setExpandedRows] = useState(null);
  const userInfo = useSelector(selectLoggedUser);
  const [bookingList, setBookingList] = useState();
  const [bookingDetail, setBookingDetail] = useState([]);

  const expandAll = () => {
    let _expandedRows = {};
    bookingList.forEach((p) => (_expandedRows[`${p.id}`] = true));
    setExpandedRows(_expandedRows);
  };

  const collapseAll = () => {
    setExpandedRows(null);
  };

  const formatCurrency = (value) => {
    return value.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });
  };

  const statusBodyTemplate = (rowData) => {
    return <Badge variant={STATUS_CODE[rowData.status]}>{STATUS_CODE[rowData.status]}</Badge>;
  };

  const dateBodyTemplate = (rowData) => {
    return moment(rowData.date).format('dddd DD/MM/YYYY');
  };

  const priceBodyTemplate = (rowData) => {
    return formatCurrency(rowData.total);
  };

  const keytimeBodyTemplate = (rowData) => {
    return SCHEDULE_TIMER[rowData.keyTime];
  };

  const servicenameBodyTemplate = (rowData) => {
    return rowData.services.serviceName;
  };

  const dentistBodyTemplate = (rowData) => {
    return rowData.dentist.firstName + ' ' + rowData.dentist.lastName;
  };

  const rowExpansionTemplate = (data) => {
    return (
      <div className="orders-subtable">
        <h5 style={{ marginBottom: '1rem', fontWeight: 'bold' }}>Appointment Detail</h5>
        <DataTable value={bookingDetail[0][data.id]} responsiveLayout="scroll">
          <Column field="id" header="Detail ID" sortable></Column>
          <Column field="keyTime" header="Appointment Time" sortable body={keytimeBodyTemplate}></Column>
          <Column field="dentist" header="Dentist Name" sortable body={dentistBodyTemplate}></Column>
          <Column field="services" header="Service" sortable body={servicenameBodyTemplate}></Column>
        </DataTable>
      </div>
    );
  };

  const header = (
    <div className="table-header-container">
      <Button icon="pi pi-plus" label="Expand All" onClick={expandAll} style={{ marginRight: '2rem' }} />
      <Button icon="pi pi-minus" label="Collapse All" onClick={collapseAll} />
    </div>
  );

  const fetchData = async () => {
    const data = await axios.get(API_ROUTES['get-booking-for-user'].replace(':id', userInfo.id));
    setBookingList(data.content);
    const obj = {};
    data.content.map(async (booking) => {
      const detail = await axios.get(API_ROUTES['get-bookingDetail-for-user'], { params: { bookingId: booking.id } });
      obj[booking.id] = detail.details;
      setBookingDetail([...bookingDetail, obj]);
    });
  };

  useEffect(() => {
    fetchData();
  }, []);

  console.log(bookingList);
  console.log(bookingDetail);

  return (
    <Box>
      <HeaderOnlyLayout />
      <Box className="bookinghistory-title">Appointment Schedule List</Box>
      <Box className="datatable-wrapper">
        <Box className="datatable-rowexpansion-demo">
          <Box className="card">
            <DataTable
              value={bookingList}
              expandedRows={expandedRows}
              onRowToggle={(e) => setExpandedRows(e.data)}
              responsiveLayout="scroll"
              rowExpansionTemplate={rowExpansionTemplate}
              dataKey="id"
              header={header}
            >
              <Column expander style={{ width: '3em' }} />
              <Column field="id" header="ID" sortable />
              <Column field="total" header="Price" sortable body={priceBodyTemplate} />
              <Column field="date" header="Date" sortable body={dateBodyTemplate} />
              <Column field="status" header="Status" sortable body={statusBodyTemplate} />
            </DataTable>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default withTranslation()(HistoryBookingPage);
