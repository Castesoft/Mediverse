import { BaseNode } from "src/app/_models/sidebar/baseNode";


export const TREE_DATA: BaseNode[] = [
  new BaseNode({
    name: 'Admin',
    route: '/admin/',
  }),
  new BaseNode({
    name: 'Usuarios',
    route: '/admin/usuarios/',
    children: [
      new BaseNode({
        name: 'Usuarios',
        route: '/admin/usuarios/',
      }),
      new BaseNode({
        name: 'Roles',
        route: '/admin/usuarios/roles/',
      }),
      new BaseNode({
        name: 'Permisos',
        route: '/admin/usuarios/permisos/',
      }),
    ],
  }),
  new BaseNode({
    name: 'Doctores',
    route: '/admin/doctores/',
  }),
  new BaseNode({
    name: 'Facturas',
    route: '/admin/facturas/',
  }),
  new BaseNode({
    name: 'Pedidos',
    route: '/admin/pedidos/',
  }),
  new BaseNode({
    name: 'Farmacia',
    route: '/admin/farmacia/',
    children: [
      new BaseNode({
        name: 'Productos',
        route: '/admin/farmacia/productos/',
      }),
      new BaseNode({
        name: 'Categorias',
        route: '/admin/farmacia/categorias/',
      }),
      new BaseNode({
        name: 'Proveedores',
        route: '/admin/farmacia/proveedores/',
      }),
    ]
  }),
  new BaseNode({
    name: 'Desarrollador',
    route: '/dev/',
    isDev: true,
  })
];
