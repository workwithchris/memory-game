import React from 'react'

import { Drawer, DrawerContent, DrawerDescription, DrawerHeader, DrawerTitle, DrawerTrigger } from '@/components/ui/drawer'

import GameInfoContent from './content'
import ProgressView from './progress-view'

export default function InfoDrawer() {
    return (
        <Drawer>
            <DrawerTrigger asChild>
                <button
                    type="button"
                    aria-label='How to play and your progress'
                    className='bg-white p-2 rounded-full cursor-pointer hover:scale-105 h-10 w-10 items-center flex absolute right-4 bottom-4'
                >
                    ⓘ
                </button>
            </DrawerTrigger>
            <DrawerContent>
                <DrawerHeader>
                    <DrawerTitle>Memory Match Game</DrawerTitle>
                    <DrawerDescription className='space-y-3 py-3'>
                        <GameInfoContent />
                        <div className='pt-4 border-t'>
                            <ProgressView />
                        </div>
                    </DrawerDescription>
                </DrawerHeader>
            </DrawerContent>
        </Drawer>
    )
}
