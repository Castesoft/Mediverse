import { FlatTreeControl } from "@angular/cdk/tree";
import { CommonModule } from "@angular/common";
import { Component, effect, inject } from "@angular/core";
import { MatTreeFlattener, MatTreeFlatDataSource } from "@angular/material/tree";
import { Router, RouterModule } from "@angular/router";
import { BaseNode, Role } from "src/app/_models/sidebar/baseNode";
import { FlatNode } from "src/app/_models/sidebar/flatNode";
import { TREE_DATA } from "src/app/_models/sidebar/sidebarConstants";
import { AccountService } from "src/app/_services/account.service";
import { DevService } from "src/app/_services/dev.service";
import { CdkModule } from "src/app/_shared/cdk.module";
import { MaterialModule } from "src/app/_shared/material.module";

@Component({
  host: { class: '', },
  selector: 'div[mainTree]',
  templateUrl: './sidebar-tree.component.html',
  standalone: true,
  imports: [ CommonModule, CdkModule, MaterialModule, RouterModule, ],
})
export class SidebarTreeComponent {
  router = inject(Router);
  account = inject(AccountService);
  dev = inject(DevService);

  private _transformer(node: BaseNode, level: number): FlatNode {
    return new FlatNode({
      expandable: !!node.children && node.children.length > 0,
      name: node.name,
      level: level,
      isDev: node.isDev,
      route: node.route,
      roles: node.roles,
    });
  };

  treeControl = new FlatTreeControl<FlatNode>(
    node => node.level,
    node => node.expandable,
  );

  treeFlattener: MatTreeFlattener<BaseNode, FlatNode, FlatNode> = new MatTreeFlattener<BaseNode, FlatNode, FlatNode>(
    this._transformer,
    node => node.level,
    node => node.expandable,
    node => node.children,
  );

  dataSource = new MatTreeFlatDataSource<BaseNode, FlatNode, FlatNode>(this.treeControl, this.treeFlattener);

  constructor() {
    effect(() => {
      const roles = this.account.roles();
      const filteredData = this.filterTree(TREE_DATA, roles, this.dev.isDev());
      this.dataSource.data = filteredData;
    });
  }

  private filterTree(nodes: BaseNode[], roles: Role[], isDev: boolean): BaseNode[] {
    return nodes
      .map(node => {
        // Recursively filter children
        const filteredChildren = node.children ? this.filterTree(node.children, roles, isDev) : [];

        // Determine if the node should be included based on roles
        const nodeHasRole =
          node.roles.length === 0 || node.roles.some(r => roles.includes(r));

        // Determine if the node should be included based on isDev
        const nodeIsDev = node.isDev === true;
        const includeNodeBasedOnDev = !nodeIsDev || (nodeIsDev && isDev);

        // Include node if it matches roles and dev mode, or has matching children
        if ((nodeHasRole && includeNodeBasedOnDev) || filteredChildren.length > 0) {
          return new BaseNode({
            ...node,
            children: filteredChildren,
          });
        } else {
          // Node does not match roles or dev mode and has no matching children
          return null;
        }
      })
      .filter(node => node !== null) as BaseNode[];
  }

  hasChild = (_: number, node: FlatNode) => node.expandable;
}
