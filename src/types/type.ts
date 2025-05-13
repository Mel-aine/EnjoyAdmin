export interface BaseMenuItem {
  icon: any;
  name: string;
  roles: number[];
}

export interface MenuLink extends BaseMenuItem {
  path: string;
  subItems?: undefined;
}

export interface MenuGroup extends BaseMenuItem {
  subItems: MenuItem[];
  path?: undefined;
}

type MenuItem = MenuLink | MenuGroup;

export interface MenuGroupWrapper {
  title: string;
  items: MenuItem[];
}
