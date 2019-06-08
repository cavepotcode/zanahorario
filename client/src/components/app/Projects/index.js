import React from 'react';
import styles from './styles.module.scss';
import api from '../../../utils/api';
import classes from '../../../utils/classes';
import { apiUrls } from '../../../urls';

export default function Projects() {
  const [projects, setProjects] = React.useState([]);

  React.useEffect(() => {
    const fetch = async () => {
      const url = apiUrls.projects(6, 2019);
      try {
        // const result = await api.get(url);
        const result = getData();
        setProjects(
          result.data.map(item => ({
            ...item,
            lastTime: new Date(item.lastTime).toLocaleDateString('es-UY')
          }))
        );
      } catch (err) {
        alert('There was an error getting the projects. Try again later.');
      }
    };

    fetch();
  }, []);

  return (
    <div className={styles.container}>
      {projects.map((item, index) => (
        <div className={classes(styles.project, index % 2 !== 0 && styles.odd)} key={item.project.id}>
          <div className={styles.title}>
            <span>{item.project.name}</span>
          </div>
          <div className={styles.selector}>hola</div>
          <div className={styles.info}>
            <span>LAST DATE: {item.lastTime}</span>
            <span>MONTH HOURS: {item.monthHours}</span>
            <span>TOTAL HOURS: {item.totalHours}</span>
          </div>
        </div>
      ))}
    </div>
  );
}

function getData() {
  return {
    data: [
      {
        project: { id: '1b34616f-3d03-45ed-9b44-5b5716cbe363', name: 'Payment', description: '' },
        lastTime: '2017-06-08T00:00:00.000Z',
        monthHours: 0,
        totalHours: 16,
        usersHoursByProject: []
      },
      {
        project: { id: '1b34616f-3d03-45ed-9b44-5b5716cbe36c', name: 'Venttio', description: '' },
        lastTime: '2018-10-11T00:00:00.000Z',
        monthHours: 0,
        totalHours: 3420,
        usersHoursByProject: []
      },
      {
        project: { id: '238c0243-449a-484d-a81f-86ec4f32f92a', name: 'Licencia', description: '' },
        lastTime: '2018-09-21T00:00:00.000Z',
        monthHours: 0,
        totalHours: 480,
        usersHoursByProject: []
      },
      {
        project: { id: '28b7420b-f591-4275-95bd-6ed3b7c52c67', name: 'IncoSA', description: '' },
        lastTime: '-271821-04-20T00:00:00.000Z',
        monthHours: 0,
        totalHours: 0,
        usersHoursByProject: []
      },
      {
        project: { id: '39bb4931-e8bb-407b-9a9c-fec41a9b6fbe', name: 'Arkano', description: '' },
        lastTime: '2018-03-22T00:00:00.000Z',
        monthHours: 0,
        totalHours: 436,
        usersHoursByProject: []
      },
      {
        project: { id: '3bf89081-b00f-4301-bc65-649471aec2fd', name: 'kinator', description: '' },
        lastTime: '2018-03-26T00:00:00.000Z',
        monthHours: 0,
        totalHours: 32,
        usersHoursByProject: []
      },
      {
        project: {
          id: '51d3ca54-f059-4d6f-95b9-5419047b1a01',
          name: 'eClinicas',
          description: 'Nuevo proyecto de UCM'
        },
        lastTime: '2019-03-13T00:00:00.000Z',
        monthHours: 0,
        totalHours: 354,
        usersHoursByProject: []
      },
      {
        project: { id: '526d0f64-7d88-4846-ac6c-4141fbce578a', name: 'Zulamian Web', description: '' },
        lastTime: '2018-10-25T00:00:00.000Z',
        monthHours: 0,
        totalHours: 175,
        usersHoursByProject: []
      },
      {
        project: { id: '54bfccd1-ad43-486b-8089-6ba9ea401e2e', name: 'MHP (InMind)', description: '' },
        lastTime: '2019-05-24T00:00:00.000Z',
        monthHours: 0,
        totalHours: 1955,
        usersHoursByProject: [
          {
            Id: null,
            Email: 'diego.caraballo@cavepot.com',
            Initials: 'DC',
            Password: null,
            UserMonthHours: 6,
            Color: '#4a43f5',
            Name: null,
            Token: null,
            ImageUrl: null
          }
        ]
      },
      {
        project: { id: '5ef83d71-a2bf-4140-9243-468b065ad9ce', name: 'UCM', description: '' },
        lastTime: '2019-05-31T00:00:00.000Z',
        monthHours: 0,
        totalHours: 4456,
        usersHoursByProject: []
      },
      {
        project: { id: '636093b1-7409-467b-b906-ccbd6a9ed6b8', name: 'fintitude', description: 'upwork project' },
        lastTime: '2019-04-30T00:00:00.000Z',
        monthHours: 0,
        totalHours: 2653,
        usersHoursByProject: []
      },
      {
        project: { id: '683b91d5-e3f9-4a40-8ca6-ecc1337e261e', name: 'Socius', description: '' },
        lastTime: '2018-05-03T00:00:00.000Z',
        monthHours: 0,
        totalHours: 397,
        usersHoursByProject: []
      },
      {
        project: { id: '6a21bddc-a59c-4af2-9b66-3d451e592626', name: 'Apple Sentiment', description: '' },
        lastTime: '2019-05-24T00:00:00.000Z',
        monthHours: 0,
        totalHours: 80,
        usersHoursByProject: [
          {
            Id: null,
            Email: 'guillermo.fernandez@cavepot.com',
            Initials: 'GF',
            Password: null,
            UserMonthHours: 28,
            Color: '#8cc528',
            Name: null,
            Token: null,
            ImageUrl: null
          }
        ]
      },
      {
        project: { id: '6bbfd791-2897-47c2-8751-d15d64d00c8b', name: 'Planet Travel', description: '' },
        lastTime: '2019-04-30T00:00:00.000Z',
        monthHours: 0,
        totalHours: 718,
        usersHoursByProject: [
          {
            Id: null,
            Email: 'diego.caraballo@cavepot.com',
            Initials: 'DC',
            Password: null,
            UserMonthHours: 28,
            Color: '#4a43f5',
            Name: null,
            Token: null,
            ImageUrl: null
          }
        ]
      },
      {
        project: { id: '6bf56aa9-aac4-4751-aa7f-72ce2465c140', name: 'UruIT', description: '' },
        lastTime: '2019-05-15T00:00:00.000Z',
        monthHours: 0,
        totalHours: 5998,
        usersHoursByProject: [
          {
            Id: null,
            Email: 'santiago.bermudez@cavepot.com',
            Initials: 'SB',
            Password: null,
            UserMonthHours: 160,
            Color: '#cac423',
            Name: null,
            Token: null,
            ImageUrl: null
          }
        ]
      },
      {
        project: {
          id: '73273532-c7bc-4328-8e08-401ee2169272',
          name: 'QuantMedia',
          description: 'Proyecto de DecemberLab'
        },
        lastTime: '2018-09-28T00:00:00.000Z',
        monthHours: 0,
        totalHours: 211,
        usersHoursByProject: []
      },
      {
        project: { id: '7bc6de48-f068-45c6-a665-7eb1ca1075cc', name: 'Estudio', description: '' },
        lastTime: '2018-02-07T00:00:00.000Z',
        monthHours: 0,
        totalHours: 40,
        usersHoursByProject: []
      },
      {
        project: { id: '90db1e14-ce1c-48e7-a9c9-0dbfff02417d', name: 'Student Global', description: '' },
        lastTime: '2017-07-28T00:00:00.000Z',
        monthHours: 0,
        totalHours: 974,
        usersHoursByProject: []
      },
      {
        project: { id: '926275c7-eea0-4f33-b3e7-fa319e5c31a3', name: 'Hint - December Labs', description: '' },
        lastTime: '2018-02-08T00:00:00.000Z',
        monthHours: 0,
        totalHours: 131,
        usersHoursByProject: []
      },
      {
        project: { id: 'ab90a6ee-e2a5-4e47-9dce-84714f13d559', name: 'Timetracker', description: '' },
        lastTime: '2018-10-01T00:00:00.000Z',
        monthHours: 0,
        totalHours: 601,
        usersHoursByProject: []
      },
      {
        project: { id: 'b9cf5cd4-e026-44cf-843d-ca5874ad1979', name: 'NOM', description: '' },
        lastTime: '2018-11-28T00:00:00.000Z',
        monthHours: 0,
        totalHours: 24,
        usersHoursByProject: []
      },
      {
        project: { id: 'c8293977-23ba-4cd0-b53f-b360462ccc59', name: 'UCM - eClinicas', description: '' },
        lastTime: '2019-02-15T00:00:00.000Z',
        monthHours: 0,
        totalHours: 483,
        usersHoursByProject: []
      },
      {
        project: {
          id: 'd0769c04-8432-4b70-9334-a82493571c5e',
          name: 'UCM - Proyectos',
          description: 'Proyectos cerrados'
        },
        lastTime: '2019-05-17T00:00:00.000Z',
        monthHours: 0,
        totalHours: 1032,
        usersHoursByProject: []
      },
      {
        project: { id: 'daf0af12-7aad-4912-89e2-3eedfa486ee0', name: 'Comed', description: '' },
        lastTime: '2018-07-16T00:00:00.000Z',
        monthHours: 0,
        totalHours: 550,
        usersHoursByProject: []
      },
      {
        project: { id: 'e4dcca96-6ba8-4f22-88be-115d8e034bcc', name: 'BROU - Capicua', description: '' },
        lastTime: '2017-11-23T00:00:00.000Z',
        monthHours: 0,
        totalHours: 80,
        usersHoursByProject: []
      },
      {
        project: { id: 'e9c5efa6-3052-4865-bdf4-034e6cb8cf71', name: 'Cavepot', description: '' },
        lastTime: '2019-05-24T00:00:00.000Z',
        monthHours: 0,
        totalHours: 5745,
        usersHoursByProject: []
      },
      {
        project: { id: 'f4451335-e65c-4cc8-97ef-0a1f0b7c862c', name: 'RepuestosYa', description: '' },
        lastTime: '2017-11-03T00:00:00.000Z',
        monthHours: 0,
        totalHours: 162,
        usersHoursByProject: []
      }
    ],
    meta: { code: 0, message: '' }
  };
}
