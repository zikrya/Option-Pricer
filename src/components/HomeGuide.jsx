'use client'
import React from 'react'
import { useState } from "react";
import { useEffect } from "react";
import { Tab } from '@headlessui/react'
const features = [
    {
      title: 'Monte Carlo',
      description:
        "The Monte Carlo model simulates numerous potential paths for an asset's price, using random variables to model market uncertainties and predict option values.",
        image: '/montecarlo.png',
    },
    {
      title: 'Finite Difference Method',
      description:
        "The Finite Difference Method systematically computes option prices by creating a grid of potential asset values over time, applying differential equations to capture price sensitivities and market dynamics",
      image: './fdm.png',
    },
    {
      title: 'Binomial Option Pricing Model',
      description:
        "The Binomial Option Pricing Model leverages a step-by-step approach, projecting numerous possible paths an asset's price could take, and calculates the option's value at each node using risk-neutral valuation, offering a straightforward yet powerful method for option pricing.",
      image: './binomial.png',
    },
  ]

const HomeGuide = () => {
    let [tabOrientation, setTabOrientation] = useState('horizontal')
    useEffect(() => {
        let lgMediaQuery = window.matchMedia('(min-width: 1024px)')

        function onMediaQueryChange({ matches }) {
          setTabOrientation(matches ? 'vertical' : 'horizontal')
        }

        onMediaQueryChange(lgMediaQuery)
        lgMediaQuery.addEventListener('change', onMediaQueryChange)

        return () => {
          lgMediaQuery.removeEventListener('change', onMediaQueryChange)
        }
      }, [])
      return (
        <section
          id="features"
          data-testid="features"
          aria-label="Features for running your books"
          className="relative overflow-hidden bg-gradient-to-r from-blue-500 to-purple-600 pb-28 pt-20 sm:py-32">
          {/*container*/}
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative">
              {/*header*/}
              <div className="max-w-2xl md:mx-auto md:text-center xl:max-w-none">
                  <h2 className="font-display text-3xl tracking-tight text-white sm:text-4xl md:text-5xl">Option Pricing Models</h2>
              </div>
              <Tab.Group
                as="div"
                className="mt-16 grid grid-cols-1 items-center gap-y-2 pt-10 sm:gap-y-6 md:mt-20 lg:grid-cols-12 lg:pt-0"
                vertical={tabOrientation === 'vertical'}
              >
                  {({ selectedIndex }) => (
                  <>
                    <div className="-mx-4 flex overflow-x-auto pb-4 sm:mx-0 sm:overflow-visible sm:pb-0 lg:col-span-5">
                      <Tab.List className="relative z-10 flex gap-x-4 whitespace-nowrap px-4 sm:mx-auto sm:px-0 lg:mx-0 lg:block lg:gap-x-0 lg:gap-y-1 lg:whitespace-normal">
                        {features.map((feature, featureIndex) => (
                          <div
                            key={feature.title}
                            className={
                              'group relative rounded-full px-4 py-1 lg:rounded-l-xl lg:rounded-r-none lg:p-6 ' +
                              (selectedIndex === featureIndex
                                ? 'bg-white lg:bg-white/10 lg:ring-1 lg:ring-inset lg:ring-white/10'
                                : 'hover:bg-white/10 lg:hover:bg-white/5')}>
                            <h3>
                              <Tab
                                className={
                                  'font-display text-lg ui-not-focus-visible:outline-none ' +
                                  (selectedIndex === featureIndex
                                    ? 'text-blue-600 lg:text-white'
                                    : 'text-blue-100 hover:text-white lg:text-white')}
                              >
                                <span className="absolute inset-0 rounded-full lg:rounded-l-xl lg:rounded-r-none" />
                                {feature.title}
                              </Tab>
                            </h3>
                            <p
                              className={
                                'mt-2 hidden text-sm lg:block ' +
                                (selectedIndex === featureIndex
                                  ? 'text-white'
                                  : 'text-blue-100 group-hover:text-white')}
                            >
                              {feature.description}
                            </p>
                          </div>
                        ))}
                      </Tab.List>
                    </div>
                    <Tab.Panels className="lg:col-span-7">
                      {features.map((feature) => (
                        <Tab.Panel key={feature.title} unmount={false}>
                          <div className="relative sm:px-6 lg:hidden">
                            <div className="absolute -inset-x-4 bottom-[-4.25rem] top-[-6.5rem] bg-white/10 ring-1 ring-inset ring-white/10 sm:inset-x-0 sm:rounded-t-xl" />
                            <p className="relative mx-auto max-w-2xl text-base text-white sm:text-center">
                              {feature.description}
                            </p>
                          </div>
                          <div className="mt-10 w-[45rem] overflow-hidden rounded-xl bg-slate-50 shadow-xl shadow-blue-900/20 sm:w-auto lg:mt-0 lg:w-[67.8125rem]">
                            <img
                              className="w-full"
                              src={feature.image}
                              alt=""
                              sizes="(min-width: 1024px) 67.8125rem, (min-width: 640px) 100vw, 45rem"
                            />
                          </div>
                        </Tab.Panel>
                      ))}
                    </Tab.Panels>
                  </>
                )}
              </Tab.Group>
          </div>
        </section>
      )
}

export default HomeGuide