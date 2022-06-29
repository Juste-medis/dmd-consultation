import Cookies from 'universal-cookie';
const cookies = new Cookies();
const _l = cookies.get('___lo_rery_yap_adi')?.substring(39);

export const dashboardRoutes = {
  label: 'Dashboard',
  labelDisable: true,
  children: [
    {
      name: 'Tableau de bord',
      active: true,
      icon: 'chart-pie',
      children: [
        ...(_l === 'super'
          ? [
              {
                name: 'Général',
                to: `/dashboard/superadmin/default`,
                exact: true,
                active: true
              }
            ]
          : []),
        {
          name: 'CONSULTATION',
          to: `/dashboard/default`,
          exact: true,
          active: true
        }
      ]
    }
  ]
};

export const SuperAdminDashRoutes = {
  label: 'Gestion Super Administrateur',
  labelDisable: true,
  children: [
    {
      name: 'Super Administrateur',
      active: true,
      icon: 'star',
      children: [
        {
          name: 'Utilisateurs',
          to: '/dashboard/sadmin/users/candidate-list',
          active: true
        },
        {
          name: 'Applications',
          to: '/dashboard/sadmin/applications/application-list',
          active: true
        },
        {
          name: 'Demandes',
          to: '/dashboard/sadmin/demands/application-list',
          active: true
        }
      ]
    }
  ]
};

const fiexp = [dashboardRoutes];
if (_l === 'super') {
  fiexp.push(SuperAdminDashRoutes);
}
export default fiexp;
