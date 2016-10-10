import { expect } from 'chai';
import React from 'react';
import sd from 'skin-deep';

import Immutable from 'seamless-immutable';

import Reservation from 'fixtures/Reservation';
import Resource from 'fixtures/Resource';
import Unit from 'fixtures/Unit';
import {
  UnconnectedReservationListContainer as ReservationListContainer,
} from './ReservationListContainer';

function getProps(props) {
  const defaults = {
    isAdmin: false,
    loading: false,
    reservations: [],
    resources: {},
    staffUnits: [],
    units: {},
  };

  return Object.assign({}, defaults, props);
}

describe('screens/user-reservations/reservation-list/ReservationListContainer', () => {
  describe('with reservations', () => {
    const unit = Unit.build();
    const resource = Resource.build({ unit: unit.id });
    const props = getProps({
      reservations: Immutable([
        Reservation.build({ resource: resource.id }),
        Reservation.build({ resource: 'unfetched-resource' }),
      ]),
      resources: Immutable({
        [resource.id]: resource,
      }),
      units: Immutable({
        [unit.id]: unit,
      }),
    });
    let tree;

    before(() => {
      tree = sd.shallowRender(<ReservationListContainer {...props} />);
    });

    it('should render a ul element', () => {
      const ulTree = tree.subTree('ul');

      expect(ulTree).to.be.ok;
    });

    describe('rendering individual reservations', () => {
      let reservationListItemTrees;

      before(() => {
        reservationListItemTrees = tree.everySubTree('ReservationListItem');
      });

      it('should render a ReservationListItem for every reservation in props', () => {
        expect(reservationListItemTrees.length).to.equal(props.reservations.length);
      });

      describe('passing correct props', () => {
        it('should pass isAdmin, isStaff and reservation', () => {
          reservationListItemTrees.forEach((reservationTree, index) => {
            const actualProps = reservationTree.props;

            expect(actualProps.isAdmin).to.equal(props.isAdmin);
            expect(actualProps.isStaff).to.equal(false);
            expect(actualProps.reservation).to.deep.equal(props.reservations[index]);
          });
        });

        it('should pass resource corresponding to reservation.resource', () => {
          expect(reservationListItemTrees[0].props.resource).to.deep.equal(resource);
        });

        it('should pass empty object as resource if resource is unfetched', () => {
          expect(reservationListItemTrees[1].props.resource).to.deep.equal({});
        });

        it('should pass unit corresponding to resource.unit', () => {
          expect(reservationListItemTrees[0].props.unit).to.deep.equal(unit);
        });

        it('should pass empty object as unit if unit or resource is unfetched', () => {
          expect(reservationListItemTrees[1].props.unit).to.deep.equal({});
        });
      });
    });
  });

  describe('without reservations', () => {
    describe('when emptyMessage is given in props', () => {
      const props = getProps({
        emptyMessage: 'No reservations found',
        reservations: [],
      });
      const tree = sd.shallowRender(<ReservationListContainer {...props} />);

      it('should display the emptyMessage', () => {
        expect(tree.textIn('p')).to.equal(props.emptyMessage);
      });
    });

    describe('when emptyMessage is not given in props', () => {
      const props = getProps({
        reservations: [],
      });
      const tree = sd.shallowRender(<ReservationListContainer {...props} />);

      it('should render a message telling no reservations were found', () => {
        const expected = 'Sinulla ei vielä ole yhtään varausta.';

        expect(tree.textIn('p')).to.equal(expected);
      });
    });
  });
});