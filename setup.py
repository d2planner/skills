from setuptools import setup

setup(
    name='mpq_data_parser',
    version='0.1',
    description='Parser for data extracted from Diablo 2 MPQ files',
    url='https://github.com/dmwinslow/d2planner',
    author='Dustin Winslow',
    author_email='dmwinslow@gmail.com',
    packages=[
        'mpq_data_parser',
    ],
    install_requires=[
        'numpy==1.20.1',
        'pandas==1.2.4',
    ],
    zip_safe=False,
)
