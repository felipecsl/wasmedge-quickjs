use crate::{quickjs_sys as qjs, Context, JsValue};
use std::borrow::BorrowMut;
use std::cell::RefCell;
use std::collections::{HashMap, LinkedList};
use std::convert::TryInto;
use std::io::{self, Read, Write};
use std::mem::ManuallyDrop;
use std::net::{SocketAddr, SocketAddrV4};
use std::ops::Add;
use std::os::fd::{AsRawFd, FromRawFd};
use std::sync::atomic::AtomicUsize;
use std::sync::Arc;

use rustls::OwnedTrustAnchor;

pub(crate) enum NetPollEvent {
    Accept,
    Read,
    Connect,
}

#[derive(Default)]
pub struct EventLoop {
    next_tick_queue: LinkedList<Box<dyn FnOnce()>>,
    immediate_queue: LinkedList<Box<dyn FnOnce()>>,
    pub(crate) waker: Option<std::task::Waker>,
    pub(crate) sub_tasks: LinkedList<tokio::task::JoinHandle<()>>,
}

impl EventLoop {
    pub fn add_immediate_task(&mut self, callback: Box<dyn FnOnce()>) {
        self.immediate_queue.push_back(callback);
    }

    pub fn run_tick_task(&mut self) -> usize {
        let mut i = 0;
        let mut cb_vec = LinkedList::new();
        while let Some(f) = self.next_tick_queue.pop_front() {
            cb_vec.push_back(f);
        }
        while let Some(f) = self.immediate_queue.pop_front() {
            cb_vec.push_back(f);
        }
        while let Some(f) = cb_vec.pop_front() {
            f();
            i += 1;
        }
        i
    }

    pub fn set_next_tick(&mut self, callback: Box<dyn FnOnce()>) {
        self.next_tick_queue.push_back(callback);
    }
}
