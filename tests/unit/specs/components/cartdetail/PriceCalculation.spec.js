import { shallowMount } from '@vue/test-utils';
import PriceCalculation from '@/components/cartdetail/PriceCalculation.vue';

describe('PriceCalculation.vue', () => {
  const me = {
    activeCart: {
      lineItems: [],
      totalPrice: {
        currencyCode: 'EUR',
        centAmount: 83050,
        fractionDigits: 2,
      },
    },
  };

  let options;

  beforeEach(() => {
    options = {
      methods: { formatPrice: jest.fn() },
      mocks: { $t: jest.fn() },
    };
  });

  it('renders a vue instance', () => {
    expect(shallowMount(PriceCalculation, options).isVueInstance()).toBeTruthy();
  });

  it('calculates applied taxes', () => {
    const wrapper = shallowMount(PriceCalculation, options);
    wrapper.setData({ me });
    expect(wrapper.vm.taxes).toBeNull();

    wrapper.setData({
      me: {
        activeCart: {
          ...me.activeCart,
          taxedPrice: {
            totalNet: {
              currencyCode: 'EUR',
              centAmount: 69790,
              fractionDigits: 2,
            },
            totalGross: {
              currencyCode: 'EUR',
              centAmount: 83050,
              fractionDigits: 2,
            },
          },
        },
      },
    });
    expect(wrapper.vm.taxes).toEqual({
      centAmount: 13260,
      currencyCode: 'EUR',
      fractionDigits: 2,
    });
  });

  it('calculates subtotal price', () => {
    const wrapper = shallowMount(PriceCalculation, options);
    wrapper.setData({ me });
    expect(wrapper.vm.subtotal).toEqual({
      centAmount: 0,
      currencyCode: 'EUR',
      fractionDigits: 2,
    });

    wrapper.setData({
      me: {
        activeCart: {
          ...me.activeCart,
          lineItems: [
            { totalPrice: { centAmount: 11111 } },
            { totalPrice: { centAmount: 22222 } },
            { totalPrice: { centAmount: 44444 } },
          ],
        },
      },
    });
    expect(wrapper.vm.subtotal).toEqual({
      centAmount: 77777,
      currencyCode: 'EUR',
      fractionDigits: 2,
    });
  });
});
