import { Box, Flex, Skeleton, Text, useColorMode } from '@chakra-ui/react';
import { MultiSelect } from 'primereact/multiselect';
import React, { useEffect, useRef, useState } from 'react';
import { withTranslation } from 'react-i18next';
import { FaCheck } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { axios } from '~/apis';
import { API_CODE, API_ROUTES, HOME_BLOCK_NAME } from '~/app/constants';
import ABOUT_BG_2 from '~/assets/images/about_2.jpg';
import FEATURE_BG_1 from '~/assets/images/feature_1.png';
import FEATURE_BG_2 from '~/assets/images/feature_2.png';
import FEATURE_BG_3 from '~/assets/images/feature_3.png';
import FEATURE_BG_4 from '~/assets/images/feature_4.png';
import { Footer } from '~/components';
import {
  About,
  Clinic,
  Dentist,
  Features,
  Images,
  Newsletter,
  OptionAdvanceDropdown,
  Quote,
  SelectedAdvanceDropdown,
  Service
} from './components';
import './Home.scss';
import GALLERY_1 from '~/assets/images/gallery_1.jpg';
import GALLERY_2 from '~/assets/images/gallery_2.jpg';
import GALLERY_3 from '~/assets/images/gallery_3.jpg';
import GALLERY_4 from '~/assets/images/gallery_4.jpg';

const MOCK_DATA = {
  feature: (t) => ({
    title: { value: t('home.features.title'), fontSize: '3rem', color: 'primary.200', fontWeight: 400 },
    desc: {
      value: t('home.features.desc'),
      color: 'grey'
    },
    category: [
      {
        img: FEATURE_BG_1,
        title: t('home.features.category.0.title'),
        desc: t('home.features.category.0.desc')
      },
      {
        img: FEATURE_BG_2,
        title: t('home.features.category.1.title'),
        desc: t('home.features.category.1.desc')
      },
      {
        img: FEATURE_BG_3,
        title: t('home.features.category.2.title'),
        desc: t('home.features.category.2.desc')
      },
      {
        img: FEATURE_BG_4,
        title: t('home.features.category.3.title'),
        desc: t('home.features.category.3.desc')
      }
    ]
  }),
  about: (t) => ({
    title: { value: t('home.about.title'), fontSize: '3rem', color: 'white', fontWeight: 400 },
    desc: {
      value: t('home.about.desc'),
      color: 'white',
      fontSize: '1.5rem'
    },
    image: ABOUT_BG_2,
    list: [
      {
        icon: FaCheck,
        title: { value: t('home.about.list.0.title'), fontSize: '2rem', color: 'white', fontWeight: 400 },
        desc: {
          value: t('home.about.list.0.desc'),
          fontSize: '1.5rem',
          opacity: 0.8
        }
      },
      {
        icon: FaCheck,
        title: { value: t('home.about.list.1.title'), fontSize: '2rem', color: 'white', fontWeight: 400 },
        desc: {
          value: t('home.about.list.1.desc'),
          fontSize: '1.5rem',
          opacity: 0.8
        }
      },
      {
        icon: FaCheck,
        title: { value: t('home.about.list.2.title'), fontSize: '2rem', color: 'white', fontWeight: 400 },
        desc: {
          value: t('home.about.list.1.desc'),
          fontSize: '1.5rem',
          opacity: 0.8
        }
      }
    ]
  }),
  dentist: (t) => ({
    title: { value: t('home.dentist.title'), fontSize: '3rem', color: 'primary.200', fontWeight: 400 },
    desc: {
      value: t('home.dentist.desc'),
      color: 'grey'
    }
  }),
  clinic: (t) => ({
    title: { value: t('home.clinic.title'), fontSize: '3rem', color: 'primary.200', fontWeight: 400 },
    desc: {
      value: t('home.clinic.desc'),
      color: 'grey'
    }
  }),
  service: (t) => ({
    title: { value: t('home.service.title'), fontSize: '3rem', color: 'primary.200', fontWeight: 400 },
    desc: {
      value: t('home.service.desc'),
      color: 'grey'
    },
    list: [
      {
        name: 'test',
        price: 12,
        procedure: 'h1 h2'
      },
      {
        name: 'test',
        price: 12,
        procedure: 'h1 h2'
      },
      {
        name: 'test',
        price: 12,
        procedure: 'h1 h2'
      },
      {
        name: 'test',
        price: 12,
        procedure: 'h1 h2'
      }
    ]
  }),
  newsletter: (t) => ({
    title: { value: t('home.newsletter.title'), fontSize: '3rem', color: 'white', fontWeight: 400 },
    desc: {
      value: t('home.newsletter.desc'),
      color: 'white'
    }
  }),
  preview: [GALLERY_1, GALLERY_2, GALLERY_3, GALLERY_4]
};

const effect = {
  initial: {
    y: 200,
    opacity: 0
  },
  animate: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.5,
      staggerChildren: 0.1
    }
  }
};

const children_effect = {
  initial: {
    y: 100,
    opacity: 0
  },
  animate: {
    y: 0,
    opacity: 1,
    transition: { type: 'spring', bounce: 0.3 }
  }
};

const HomePage = ({ t }) => {
  const { feature, about, dentist, clinic, service, newsletter, preview } = MOCK_DATA;

  const [selectedClinic, setSelectedClinic] = useState();
  const [selectedDentist, setSelectedDentist] = useState();
  const [dentists, setDentists] = useState([]);
  const [dentistFilter, setDentistFilter] = useState([]);
  const [dentistOpts, setDentistOpts] = useState([]);
  const [clinicsOpts, setClinicsOpts] = useState([]);
  const [clinicsFilter, setClinicsFilter] = useState([]);
  const [clinics, setClinics] = useState([]);
  const [loading, setLoading] = useState(false);
  const loadLazyTimeout = useRef(null);
  const { colorMode } = useColorMode();

  const panelFooterTemplate = (name) => {
    let length;
    switch (name) {
      case HOME_BLOCK_NAME.dentist:
        length = selectedDentist ? selectedDentist.length : 0;
        break;
      case HOME_BLOCK_NAME.clinic:
        length = selectedClinic ? selectedClinic.length : 0;
        break;
    }

    return (
      <Box p="1rem 1.5rem" fontSize="1.4rem" color={colorMode === 'light' ? 'black' : 'white'}>
        <Text as="span" fontWeight="600">
          {length}
        </Text>{' '}
        item{length > 1 ? 's' : ''} selected.
      </Box>
    );
  };

  const renderHeader = ({ ...passProps }) => {
    const onLazyLoad = () => {
      setLoading(true);

      if (loadLazyTimeout.current) {
        clearTimeout(loadLazyTimeout.current);
      }

      //imitate delay of a backend call
      loadLazyTimeout.current = setTimeout(() => {
        setLoading(false);
      }, Math.random() * 500 + 250);
    };

    return (
      <Box
        sx={{
          '@media screen and (max-width: 767px)': {
            p: '1rem',
            mb: '2rem'
          }
        }}
        className="carousel-header"
        mb="1rem"
        p="1rem 2rem"
        borderTop="1px solid"
        borderBottom="1px solid"
        borderColor={colorMode === 'light' ? '#dee2e6' : 'grey'}
      >
        <MultiSelect
          className={colorMode === 'light' ? '' : 'dark'}
          itemTemplate={OptionAdvanceDropdown}
          selectedItemTemplate={SelectedAdvanceDropdown}
          emptyFilterMessage="no result can be found"
          panelClassName={colorMode === 'light' ? '' : 'dropdown-panel dark'}
          virtualScrollerOptions={{
            lazy: true,
            onLazyLoad: onLazyLoad,
            itemSize: 1,
            showLoader: true,
            loading: loading,
            delay: 250,
            loadingTemplate: () => {
              return (
                <Flex align="center" p="1rem">
                  <Skeleton width="100%" height="1.7rem" />
                </Flex>
              );
            }
          }}
          {...passProps}
        />
      </Box>
    );
  };

  const handleFilterDropdown = (name) => {
    let unique;
    switch (name) {
      case HOME_BLOCK_NAME.dentist:
        if (selectedDentist?.length > 0) {
          unique = selectedDentist.map((item) => dentistOpts.find((v) => v.id === item.id));
          setDentistFilter(unique);
        } else {
          setDentistFilter(dentists);
        }
        break;
      case HOME_BLOCK_NAME.clinic:
        if (selectedClinic?.length > 0) {
          unique = selectedClinic.map((item) => clinicsOpts.find((v) => v.id === item.id));
          setClinicsFilter(unique);
        } else {
          setClinicsFilter(clinics);
        }
        break;
    }
  };

  const fetchData = async () => {
    try {
      const [
        { code: dentistCode, content: dentistContent },
        { code: dentistOptCode, content: dentistOptContent },
        { code: clinicCode, content: clinicContent },
        { code: clinicOptCode, content: clinicOptContent }
      ] = await Promise.all([
        axios.get(API_ROUTES.dentists),
        axios.get(API_ROUTES.dentists, {
          params: {
            _all: true
          }
        }),
        axios.get(API_ROUTES['get-clinics']),
        axios.get(API_ROUTES['get-clinics'], {
          params: {
            _all: true
          }
        })
      ]);

      if (
        +dentistCode === API_CODE.invalidToken ||
        +dentistOptCode === API_CODE.invalidToken ||
        +clinicCode === API_CODE.invalidToken ||
        +clinicOptCode === API_CODE.invalidToken
      ) {
        throw new Error('have to login first');
      }

      if (+dentistCode === API_CODE.OK) {
        setDentists(dentistContent);
        setDentistFilter(dentistContent);
      } else {
        throw new Error('can not fetch dentist data');
      }

      if (+dentistOptCode === API_CODE.OK) {
        setDentistOpts(dentistOptContent);
      } else {
        throw new Error('can not fetch all dentist data');
      }

      if (+clinicCode === API_CODE.OK) {
        setClinics(clinicContent);
        setClinicsFilter(clinicContent);
      } else {
        throw new Error('can not fetch clinic data');
      }

      if (+clinicOptCode === API_CODE.OK) {
        setClinicsOpts(clinicOptContent);
      } else {
        throw new Error('can not fetch all clinic data');
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    if (selectedClinic?.length === 0) {
      handleFilterDropdown(HOME_BLOCK_NAME.clinic);
    }

    if (selectedDentist?.length === 0) {
      handleFilterDropdown(HOME_BLOCK_NAME.dentist);
    }
  }, [selectedClinic, selectedDentist]);

  useEffect(() => {
    fetchData();

    // will unmout
    return () => {
      window.scrollTo(0, 0);
    };
  }, []);

  return (
    <>
      <Features effect={effect} children_effect={children_effect} feature={feature(t)} />

      {about && <About about={about(t)} effect={effect} children_effect={children_effect} />}

      <Dentist
        dentist={dentist(t)}
        dentists={dentistFilter}
        dentistOpts={dentistOpts}
        effect={effect}
        renderHeader={renderHeader}
        selectedDentist={selectedDentist}
        setSelectedDentist={setSelectedDentist}
        onFilterDropdown={handleFilterDropdown}
        panelFooterTemplate={panelFooterTemplate}
      />

      <Clinic
        clinic={clinic(t)}
        clinics={clinicsFilter}
        clinicOpts={clinicsOpts}
        effect={effect}
        renderHeader={renderHeader}
        selectedClinic={selectedClinic}
        setSelectedClinic={setSelectedClinic}
        onFilterDropdown={handleFilterDropdown}
        panelFooterTemplate={panelFooterTemplate}
      />

      <Service service={service(t)} effect={effect} />

      <Newsletter newsletter={newsletter(t)} effect={effect} />

      <Images preview={preview} />

      <Quote effect={effect} />

      <Footer />
    </>
  );
};

export default withTranslation()(HomePage);
