import Cookies from 'universal-cookie';
const cookies = new Cookies();
const _l = cookies.get('___lo_rery_yap_adi')?.substring(39);
console.log(_l);

export const dashboardRoutes = {
  label: 'Dashboard',
  labelDisable: true,
  children: [
    {
      name: 'Tableau de bord',
      active: true,
      icon: 'chart-pie',
      children: [
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
      name: 'Administrateur',
      active: true,
      icon: 'star',
      children: [
        {
          name: 'FORMULAIRE',
          to: '/dashboard/admin/formulaire',
          active: true
        },
        {
          name: 'Utilisateurs',
          to: '/dashboard/admin/users',
          active: true
        }
      ]
    }
  ]
};

const fiexp = [dashboardRoutes];
if (_l === 'admin') {
  fiexp.push(SuperAdminDashRoutes);
}
export default fiexp;
