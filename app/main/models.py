from sqlalchemy.sql.schema import CheckConstraint, UniqueConstraint
from app import db

class Transaction(db.Model):
    __tablename__ = 'trans'
    input_format = "%d.%m.%Y %H:%M"

    id = db.Column(db.Integer, primary_key=True)
    amount = db.Column(db.Float, nullable=False)
    is_expense = db.Column(db.Boolean, nullable=False)
    currency_id = db.Column(db.Integer, db.ForeignKey('currency.id'), nullable=False)
    account_id = db.Column(db.Integer, db.ForeignKey('account.id'))
    agent_id = db.Column(db.Integer, db.ForeignKey('agent.id'), nullable=False)
    date_issued = db.Column(db.DateTime, nullable=False)
    comment = db.Column(db.String(120))

    account = db.relationship("Account", backref="transactions")
    agent = db.relationship("Agent", backref="transactions")
    currency = db.relationship("Currency", backref="transactions")

    def api(self, deep=False):
        return {
            "id": self.id,
            "account": self.account.api() if deep else self.account.id,
            "is_expense": self.is_expense,
            "amount": self.amount,
            "agent": self.agent.api() if deep else self.agent.id,
            "comment": self.comment,
            "date_issued": self.date_issued.strftime(self.input_format),
            "currency": self.account.currency.api() if deep else self.account.currency.id,
            "flows": [fl.api() for fl in self.flows] if deep else [fl.id for fl in self.flows],
            "records": [rec.api() for rec in self.records] if deep else [rec.id for rec in self.records]
        }

class Record(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    amount = db.Column(db.Float, nullable=False)
    category_id = db.Column(db.Integer, db.ForeignKey('category.id'), nullable=False)
    trans_id = db.Column(db.Integer, db.ForeignKey('trans.id'), nullable=False)

    trans = db.relationship('Transaction', backref='records')
    category = db.relationship('Category', backref='records')

    __table_args__ = (
        UniqueConstraint('category_id', 'trans_id'),
    )

    def api(self, deep=False):
        return {
            "id": self.id,
            "amount": self.amount,
            "category": self.category.api() if deep else self.category.id,
            "transaction": self.trans.api() if deep else self.trans.id
        }

class Flow(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    amount = db.Column(db.Float, nullable=False)
    is_debt = db.Column(db.Boolean, nullable=False)
    agent_id = db.Column(db.Integer, db.ForeignKey('agent.id'), nullable=False)
    trans_id = db.Column(db.Integer, db.ForeignKey('trans.id'), nullable=False)

    agent = db.relationship('Agent', backref='flows')
    trans = db.relationship('Transaction', backref='flows')

    __table_args__ = (
        UniqueConstraint('agent_id', 'trans_id'),
    )

    def api(self, deep=False):
        return {
            "id": self.id,
            "amount": self.amount,
            "agent": self.agent.api() if deep else self.agent.id,
            "transaction": self.trans.api() if deep else self.trans.id
        }

class AccountTransfer(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    src_amount = db.Column(db.Float, nullable=False)
    dst_amount = db.Column(db.Float, nullable=False)
    src_id = db.Column(db.Integer, db.ForeignKey('account.id'), nullable=False)
    dst_id = db.Column(db.Integer, db.ForeignKey('account.id'), nullable=False)
    date_issued = db.Column(db.DateTime)
    comment = db.Column(db.String(120))

    src = db.relationship("Account", backref="out_transfers", foreign_keys=[src_id])
    dst = db.relationship("Account", backref="in_transfers", foreign_keys=[dst_id])

    __table_args__ = (
        CheckConstraint('src_id != dst_id'),
    )

    def api(self, deep=False):
        return {
            "id": self.id,
            "src_amount": self.src_amount,
            "dst_amount": self.dst_amount,
            "src": self.src.api() if deep else self.src.id,
            "dst": self.dst.api() if deep else self.dst.id,
            "date_issued": self.date_issued.strftime("%d.%m.%Y %H:%M"),
            "comment": self.comment
        }

class Currency(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    code = db.Column(db.String(3), nullable=False, unique=True)
    decimals = db.Column(db.Integer, CheckConstraint("decimals >= 0"), nullable=False)

    def format(self, number: float) -> str:
        return "{n:,.{d}f}".format(n=number, d=self.decimals)

    def api(self, deep=False):
        d = {
            "id": self.id,
            "code": self.code,
            "decimals": self.decimals,
        }
        if deep:
            d["accounts"] = [acc.id for acc in self.accounts]
        return d

class Agent(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    desc = db.Column(db.String(64), nullable=False, unique=True)

    def api(self, deep=False):
        d = {
            "id": self.id,
            "desc": self.desc,
        }
        if deep:
            d["flows"] = [flow.id for flow in self.flows]
            d["transactions"] = [tr.id for tr in self.transactions]
        
        return d

class Category(db.Model):
    # pylint: disable=no-member

    id = db.Column(db.Integer, primary_key=True)
    desc = db.Column(db.String(64), nullable=False)
    is_expense = db.Column(db.Boolean, nullable=False)
    usable = db.Column(db.Boolean, nullable=False)
    parent_id = db.Column(db.Integer, db.ForeignKey('category.id'))

    parent = db.relationship("Category", backref="children", remote_side=[id])

    __table_args__ = (
        CheckConstraint('parent_id != id'),
        UniqueConstraint('desc', 'is_expense')
    )

    def api(self, deep=False):
        d = {
            "id": self.id,
            "desc": self.desc,
            "is_expense": self.is_expense,
            "parent": self.parent.api() if self.parent_id is not None else None,
            "children": [category.api() for category in self.children] if deep else [category.id for category in self.children]
        }
        if deep:
            d["records"] = [tr.id for tr in self.records]
        
        return d