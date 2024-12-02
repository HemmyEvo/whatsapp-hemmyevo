"use client"
import React, { useEffect } from 'react';
import SideNav from '@/components/shared/SideNav';
import { useMutation, useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';

type Props = React.PropsWithChildren<{}>;
const Layout = ({ children }: Props) => {
  const setOnline = useMutation(api.user.setUsersOnline);
  const setOffline = useMutation(api.user.setUsersOnline);
  const lastSeen = new Date().getTime();
  useEffect(() => {
    const socket = new WebSocket('wss://exciting-marlin-134.convex.cloud/api/1.17.0/sync');

    socket.onopen = () => {
      setOnline({
        lastSeen
      }) 
    };

    socket.onclose = (event) => {
      if (event.code === 1006) {
        console.log('WebSocket closed with code 1006');
        setOffline({
          lastSeen
        }) 
      }
    };

    return () => {
      socket.close();
    };
  }, []);

  return <SideNav>{children}</SideNav>;
};

export default Layout;
